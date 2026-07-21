import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createPaystackSubaccount,
  resolvePaystackAccount,
} from "@/lib/paystack/client";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { audit } from "@/server/audit";

const schema = z.object({
  bankCode: z.string().trim().regex(/^\d{2,10}$/),
  accountNumber: z.string().trim().regex(/^\d{10}$/),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const session = await createClient();
    const { data: claims } = await session.auth.getClaims();
    const userId = claims?.claims?.sub;
    const email = String(claims?.claims?.email ?? "");
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    await enforceRateLimit({
      scope: "seller-payment-account",
      identifier: userId,
      limit: 5,
      windowSeconds: 3600,
    });

    const db = createAdminClient();
    const { data: business, error: businessError } = await db
      .from("seller_businesses")
      .select("id,business_name,whatsapp_phone")
      .eq("owner_profile_id", userId)
      .single();
    if (businessError || !business) {
      return NextResponse.json(
        { error: "Complete your business details first." },
        { status: 409 },
      );
    }

    const { data: existing } = await db
      .from("seller_payment_accounts")
      .select("id,subaccount_code")
      .eq("seller_id", business.id)
      .maybeSingle();
    if (existing?.subaccount_code) {
      return NextResponse.json(
        { error: "A settlement account is already connected. Contact support to replace it safely." },
        { status: 409 },
      );
    }

    const resolved = await resolvePaystackAccount(input);
    const subaccount = await createPaystackSubaccount({
      businessName: business.business_name,
      bankCode: input.bankCode,
      accountNumber: input.accountNumber,
      email,
      phone: business.whatsapp_phone,
    });
    if (resolved.account_name !== subaccount.account_name) {
      throw new Error("Paystack returned inconsistent account details. Nothing was saved.");
    }

    const record = {
      seller_id: business.id,
      provider: "paystack",
      bank_code: input.bankCode,
      account_number_last4: input.accountNumber.slice(-4),
      account_name: resolved.account_name,
      subaccount_code: subaccount.subaccount_code,
      provider_verified: subaccount.is_verified,
      status: subaccount.is_verified ? "active" : "pending",
      metadata: { account_resolved: true, environment: process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_test_") ? "test" : "live" },
    };
    const { data: saved, error } = await db
      .from("seller_payment_accounts")
      .upsert(record, { onConflict: "seller_id" })
      .select("id,account_name,account_number_last4,status")
      .single();
    if (error) throw error;

    await audit({
      actorId: userId,
      action: "seller.payment_account_connected",
      resourceType: "seller_payment_account",
      resourceId: saved.id,
      after: {
        bankCode: input.bankCode,
        accountNumberLast4: saved.account_number_last4,
        accountName: saved.account_name,
        status: saved.status,
      },
      request,
    });
    return NextResponse.json({ ok: true, account: saved });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Choose a bank and enter a valid 10-digit account number." },
        { status: 400 },
      );
    }
    console.error("seller-payment-account", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment account could not be connected." },
      { status: 502 },
    );
  }
}
