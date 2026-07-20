import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack/signature";
import { createAdminClient } from "@/lib/supabase/admin";
import { processGrowthAfterFullPayment } from "@/server/growth";

export async function POST(request: Request) {
  const raw = await request.text(),
    signature = request.headers.get("x-paystack-signature"),
    secret =
      process.env.PAYSTACK_WEBHOOK_SECRET ||
      process.env.PAYSTACK_SECRET_KEY ||
      "";
  if (!verifyPaystackSignature(raw, signature, secret))
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  let eventKey: string | undefined;
  const db = createAdminClient();
  try {
    const event = JSON.parse(raw),
      reference =
        event?.data?.reference ??
        event?.data?.transaction_reference ??
        event?.data?.refund_reference ??
        "unknown";
    eventKey = createHash("sha256")
      .update(`${event.event}:${reference}:${raw}`)
      .digest("hex");
    const { error: insertError } = await db
      .from("payment_webhook_events")
      .insert({
        provider: "paystack",
        event_key: eventKey,
        event_type: event.event,
        signature_valid: true,
        payload: event,
      });
    if (insertError?.code === "23505")
      return NextResponse.json({ ok: true, duplicate: true });
    if (insertError) throw insertError;

    if (event.event === "charge.success") {
      const { data: payment } = await db
        .from("payments")
        .select("amount_kobo,currency")
        .eq("provider_reference", event.data.reference)
        .single();
      if (
        !payment ||
        Number(payment.amount_kobo) !== Number(event.data.amount) ||
        payment.currency !== event.data.currency
      )
        throw new Error("Webhook amount or currency mismatch");
      const { data: orderId, error } = await db.rpc("convert_payment_success", {
        p_reference: event.data.reference,
        p_provider_id: String(event.data.id),
        p_channel: event.data.channel ?? "unknown",
        p_paid_at: event.data.paid_at ?? new Date().toISOString(),
        p_summary: {
          id: event.data.id,
          status: event.data.status,
          amount: event.data.amount,
          currency: event.data.currency,
          channel: event.data.channel,
        },
      });
      if (error) throw error;
      await processGrowthAfterFullPayment(String(orderId));
    } else if (
      typeof event.event === "string" &&
      event.event.startsWith("refund.")
    ) {
      const transactionReference = event.data?.transaction_reference;
      const { data: payment } = await db
        .from("payments")
        .select("id,order_id")
        .eq("provider_reference", transactionReference)
        .maybeSingle();
      if (!payment) throw new Error("Refund payment record was not found");
      const { data: refund } = await db
        .from("refund_records")
        .select("id,provider_summary")
        .eq("payment_id", payment.id)
        .eq("status", "submitted")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!refund) throw new Error("Submitted refund record was not found");
      const providerSummary = {
        ...(refund.provider_summary ?? {}),
        event: event.event,
        status: event.data?.status,
        reason: event.data?.reason,
        receivedAt: new Date().toISOString(),
      };
      if (event.event === "refund.processed") {
        const { error } = await db.rpc("complete_refund_record", {
          p_refund: refund.id,
          p_provider_reference: String(
            event.data?.refund_reference ?? event.data?.id ?? "",
          ),
          p_provider_summary: providerSummary,
        });
        if (error) throw error;
      } else if (event.event === "refund.failed") {
        await db
          .from("refund_records")
          .update({ status: "failed", provider_summary: providerSummary })
          .eq("id", refund.id);
        const before =
          typeof refund.provider_summary?.orderStatusBefore === "string"
            ? refund.provider_summary.orderStatusBefore
            : "paid";
        await db
          .from("orders")
          .update({ status: before })
          .eq("id", payment.order_id)
          .eq("status", "refund_pending");
        await db
          .from("order_events")
          .insert({
            order_id: payment.order_id,
            event_type: "refund_failed",
            from_status: "refund_pending",
            to_status: before,
            actor_type: "paystack",
            public_message: "Refund needs review",
          });
      } else
        await db
          .from("refund_records")
          .update({ provider_summary: providerSummary })
          .eq("id", refund.id);
    }
    await db
      .from("payment_webhook_events")
      .update({
        processing_status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("event_key", eventKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("paystack-webhook", error);
    if (eventKey)
      await db
        .from("payment_webhook_events")
        .update({
          processing_status: "failed",
          error_message: (error instanceof Error
            ? error.message
            : "Webhook processing failed"
          ).slice(0, 500),
          processed_at: new Date().toISOString(),
        })
        .eq("event_key", eventKey);
    return NextResponse.json({ ok: true });
  }
}
