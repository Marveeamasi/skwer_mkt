import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { otpMatches } from "@/lib/security/otp";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";

const schema = z.object({ email: z.email().max(254), code: z.string().regex(/^\d{6}$/), password: z.string().min(8).max(72) });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();
    const secret = process.env.ORDER_TOKEN_SECRET;
    if (!secret) throw new Error("Password reset is unavailable");
    await enforceRateLimit({ scope: "password-reset-confirm", identifier: `${requestIdentifier(request)}:${email}`, limit: 8, windowSeconds: 900 });
    const db = createAdminClient();
    const { data: active } = await db.from("email_verification_otps").select("*").eq("email", email).eq("purpose", "password_reset").is("consumed_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(5);
    const otp = active?.find((candidate) => candidate.attempts < 5 && otpMatches(email, input.code, secret, candidate.code_hash));
    if (!otp) {
      for (const candidate of active ?? []) await db.from("email_verification_otps").update({ attempts: candidate.attempts + 1 }).eq("id", candidate.id).is("consumed_at", null);
      return NextResponse.json({ error: "That code is invalid or expired." }, { status: 400 });
    }
    const { data: claimed } = await db.from("email_verification_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otp.id).is("consumed_at", null).select("id").maybeSingle();
    if (!claimed) return NextResponse.json({ error: "That code has already been used." }, { status: 409 });
    const { data: link, error: linkError } = await db.auth.admin.generateLink({ type: "recovery", email });
    if (linkError || !link?.user) return NextResponse.json({ error: "That code is invalid or expired." }, { status: 400 });
    const { error } = await db.auth.admin.updateUserById(link.user.id, { password: input.password });
    if (error) throw error;
    await db.from("email_verification_otps").update({ consumed_at: new Date().toISOString() }).eq("email", email).eq("purpose", "password_reset").is("consumed_at", null);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429 });
    if (error instanceof ZodError) return NextResponse.json({ error: "Enter a valid code and a password of at least 8 characters." }, { status: 400 });
    console.error("password-reset-confirm", error);
    return NextResponse.json({ error: "Password could not be changed. Request a new code and try again." }, { status: 500 });
  }
}
