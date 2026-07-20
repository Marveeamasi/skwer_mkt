import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeNigerianPhone } from "@/lib/security/phone";
import { audit } from "@/server/audit";
const schema = z.object({
  businessName: z.string().min(2).max(100),
  whatsappPhone: z.string(),
  category: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  shortDescription: z.string().min(10).max(240),
  pickupNote: z.string().max(500),
  deliveryNote: z.string().max(500),
  returnPolicy: z.string().min(10).max(1500),
  termsAccepted: z.literal(true),
});
function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json()),
      session = await createClient(),
      { data } = await session.auth.getClaims(),
      userId = data?.claims?.sub,
      email = String(data?.claims?.email ?? "");
    if (!userId)
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const db = createAdminClient(),
      row = {
        owner_profile_id: userId,
        business_name: input.businessName,
        slug: `${slug(input.businessName)}-${userId.slice(0, 6)}`,
        category: input.category,
        whatsapp_phone: normalizeNigerianPhone(input.whatsappPhone),
        email,
        city: input.city,
        state: input.state,
        short_description: input.shortDescription,
        pickup_note: input.pickupNote,
        delivery_note: input.deliveryNote,
        return_policy: input.returnPolicy,
        fulfilment_methods: ["pickup"],
        terms_accepted_at: new Date().toISOString(),
      },
      { data: business, error } = await db
        .from("seller_businesses")
        .upsert(row, { onConflict: "owner_profile_id" })
        .select()
        .single();
    if (error) throw error;
    await audit({
      actorId: userId,
      action: "seller.onboarding_saved",
      resourceType: "seller_business",
      resourceId: business.id,
      after: { category: input.category, city: input.city, state: input.state },
      request,
    });
    return NextResponse.json({ ok: true, businessId: business.id });
  } catch (error) {
    console.error("seller-onboarding", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save business",
      },
      { status: 400 },
    );
  }
}
