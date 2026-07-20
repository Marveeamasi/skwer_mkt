import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeNigerianPhone } from "@/lib/security/phone";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
const schema = z.object({
  campaignCode: z.string(),
  fullName: z.string().min(2),
  phone: z.string(),
  email: z.email(),
  variation: z.string().min(1),
  quantity: z.number().int().positive().max(20),
  maximumPriceKobo: z.number().int().positive().optional(),
});
export async function POST(request: Request) {
  try {
    const i = schema.parse(await request.json());
    await enforceRateLimit({
      scope: "restock",
      identifier: requestIdentifier(request),
      limit: 8,
      windowSeconds: 3600,
    });
    const db = createAdminClient(),
      { data: c } = await db
        .from("campaigns")
        .select("id,seller_id,allow_restock_interest")
        .eq("short_code", i.campaignCode)
        .single();
    if (!c?.allow_restock_interest) throw new Error();
    const { data: customer, error } = await db
      .from("customers")
      .upsert(
        {
          full_name: i.fullName,
          normalized_phone: normalizeNigerianPhone(i.phone),
          email: i.email.toLowerCase(),
        },
        { onConflict: "normalized_phone,email" },
      )
      .select()
      .single();
    if (error) throw error;
    await db
      .from("restock_interests")
      .insert({
        seller_id: c.seller_id,
        campaign_id: c.id,
        customer_id: customer.id,
        variant_request: { label: i.variation },
        quantity: i.quantity,
        maximum_price_kobo: i.maximumPriceKobo,
      });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError)
      return NextResponse.json({ error: error.message }, { status: 429 });
    return NextResponse.json(
      { error: "We could not save this request." },
      { status: 400 },
    );
  }
}
