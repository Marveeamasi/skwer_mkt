import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOtp, hashOtp } from "@/lib/security/otp";
import { sendTransactionalEmail } from "@/lib/email/client";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
import { publicConfig } from "@/lib/config";

const schema = z.object({ email: z.email().max(254) });
const genericMessage = "If a seller account exists for that email, a six-digit reset code has been sent.";
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();
    const secret = process.env.ORDER_TOKEN_SECRET;
    if (!secret) throw new Error("Password reset is unavailable");
    await enforceRateLimit({ scope: "password-reset-request", identifier: `${requestIdentifier(request)}:${email}`, limit: 3, windowSeconds: 900 });
    const db = createAdminClient();
    const { data: link } = await db.auth.admin.generateLink({ type: "recovery", email });
    if (!link?.user) return NextResponse.json({ ok: true, message: genericMessage });
    const code = createOtp();
    const { data: otp, error } = await db.from("email_verification_otps").insert({ email, purpose: "password_reset", code_hash: hashOtp(email, code, secret), expires_at: new Date(Date.now() + 10 * 60_000).toISOString() }).select("id").single();
    if (error) throw error;
    try {
      await sendTransactionalEmail({ to: email, subject: `Reset your ${publicConfig.NEXT_PUBLIC_APP_SHORT_NAME} password`, html: `<p>Your password reset code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p>`, text: `Your ${publicConfig.NEXT_PUBLIC_APP_SHORT_NAME} password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.` });
    } catch (error) {
      await db.from("email_verification_otps").delete().eq("id", otp.id);
      throw error;
    }
    return NextResponse.json({ ok: true, message: genericMessage });
  } catch (error) {
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429 });
    if (error instanceof ZodError) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    console.error("password-reset-request", error);
    return NextResponse.json({ error: "Password reset email is temporarily unavailable." }, { status: 502 });
  }
}
