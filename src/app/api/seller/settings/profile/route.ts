import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { normalizeNigerianPhone } from "@/lib/security/phone";
import { audit } from "@/server/audit";

const schema = z.object({
  businessName: z.string().trim().min(2).max(100),
  whatsappPhone: z.string().trim().min(7).max(24),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  shortDescription: z.string().trim().min(10).max(240),
  pickupNote: z.string().trim().max(500),
  deliveryNote: z.string().trim().max(500),
  returnPolicy: z.string().trim().min(10).max(1500),
});

export async function PATCH(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const db = await createClient();
    const { data: claims } = await db.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { data: before } = await db.from("seller_businesses").select("id,business_name,whatsapp_phone,city,state,short_description,pickup_note,delivery_note,return_policy").maybeSingle();
    if (!before) return NextResponse.json({ error: "Complete business setup first" }, { status: 404 });
    const updates = {
      business_name: input.businessName,
      whatsapp_phone: normalizeNigerianPhone(input.whatsappPhone),
      city: input.city,
      state: input.state,
      short_description: input.shortDescription,
      pickup_note: input.pickupNote,
      delivery_note: input.deliveryNote,
      return_policy: input.returnPolicy,
    };
    const { error } = await db.from("seller_businesses").update(updates).eq("id", before.id);
    if (error) throw error;
    await audit({ actorId: userId, action: "seller.profile_updated", resourceType: "seller_business", resourceId: before.id, before, after: updates, request });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Check each business field and try again." }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Profile could not be saved" }, { status: 400 });
  }
}
