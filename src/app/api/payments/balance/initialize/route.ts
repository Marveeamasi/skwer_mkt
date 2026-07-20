import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { publicConfig } from "@/lib/config";
import { initializePaystack } from "@/lib/paystack/client";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
import { hashToken } from "@/lib/security/tokens";
import { createAdminClient } from "@/lib/supabase/admin";
const schema = z.object({ token: z.string().min(32).max(200) });
export async function POST(request: Request) {
  try {
    await enforceRateLimit({
      scope: "balance_initialize",
      identifier: requestIdentifier(request),
      limit: 8,
      windowSeconds: 600,
    });
    const { token } = schema.parse(await request.json()),
      db = createAdminClient();
    const { data: link } = await db
      .from("order_payment_links")
      .select(
        "id,status,expires_at,order:orders(id,public_reference,total_due_kobo,total_paid_kobo,status,customer:customers(email),payment_account:seller_businesses(payment:seller_payment_accounts(subaccount_code)))",
      )
      .eq("public_token_hash", hashToken(token))
      .maybeSingle();
    if (
      !link ||
      link.status !== "active" ||
      new Date(link.expires_at) <= new Date()
    )
      return NextResponse.json(
        { error: "This balance link is invalid or expired" },
        { status: 404 },
      );
    const order = Array.isArray(link.order) ? link.order[0] : link.order;
    if (!order) throw new Error("Order was not found");
    const outstanding =
      Number(order.total_due_kobo) - Number(order.total_paid_kobo);
    if (outstanding <= 0)
      return NextResponse.json(
        { error: "This order is already fully paid" },
        { status: 409 },
      );
    const customer = Array.isArray(order.customer)
      ? order.customer[0]
      : order.customer;
    const business = Array.isArray(order.payment_account)
      ? order.payment_account[0]
      : order.payment_account;
    const paymentAccount = Array.isArray(business?.payment)
      ? business.payment[0]
      : business?.payment;
    const reference = `BAL-${nanoid(20)}`;
    const { error: paymentError } = await db
      .from("payments")
      .insert({
        order_id: order.id,
        order_payment_link_id: link.id,
        provider_reference: reference,
        amount_kobo: outstanding,
        payment_type: "balance",
      });
    if (paymentError?.code === "23505")
      return NextResponse.json(
        {
          error:
            "A payment is already open for this balance link. Complete it or ask the seller for a new link.",
        },
        { status: 409 },
      );
    if (paymentError) throw paymentError;
    const initialized = await initializePaystack({
      email: customer?.email,
      amount: outstanding,
      reference,
      callbackUrl: `${publicConfig.NEXT_PUBLIC_APP_URL}/payment/callback`,
      subaccount: paymentAccount?.subaccount_code,
      metadata: {
        orderReference: order.public_reference,
        paymentType: "balance",
        balanceLinkId: link.id,
      },
    });
    await db
      .from("payments")
      .update({
        authorization_url: initialized.data.authorization_url,
        status: "pending",
      })
      .eq("provider_reference", reference);
    return NextResponse.json({
      authorizationUrl: initialized.data.authorization_url,
    });
  } catch (error) {
    if (error instanceof RateLimitError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      { error: "Balance payment could not be started" },
      { status: 400 },
    );
  }
}
