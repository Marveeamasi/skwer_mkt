import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOtp, hashOtp } from "@/lib/security/otp";
import { EmailDeliveryError, sendTransactionalEmail } from "@/lib/email/client";
import { publicConfig } from "@/lib/config";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
const schema = z.object({ email: z.email().max(254) });
export async function POST(request: Request) {
  let otpId: string | undefined;
  try {
    const { email } = schema.parse(await request.json()),
      normalized = email.trim().toLowerCase(),
      secret = process.env.ORDER_TOKEN_SECRET;
    if (!secret) throw new Error("OTP secret is not configured");
    await enforceRateLimit({
      scope: "signup-otp",
      identifier: `${requestIdentifier(request)}:${normalized}`,
      limit: 3,
      windowSeconds: 900,
    });
    const db = createAdminClient(),
      code = createOtp(),
      now = new Date();
    await db
      .from("email_verification_otps")
      .delete()
      .eq("email", normalized)
      .eq("purpose", "seller_signup")
      .or(`expires_at.lte.${now.toISOString()},consumed_at.not.is.null`);
    const { data, error } = await db
      .from("email_verification_otps")
      .insert({
        email: normalized,
        code_hash: hashOtp(normalized, code, secret),
        expires_at: new Date(now.getTime() + 10 * 60_000).toISOString(),
      })
      .select("id")
      .single();
    if (error) throw error;
    otpId = data.id;
    let delivery;
    try {
      delivery = await sendTransactionalEmail({
        to: normalized,
        subject: `Your ${publicConfig.NEXT_PUBLIC_APP_SHORT_NAME} verification code`,
        html: `<p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you did not request it, ignore this email.</p>`,
        text: `Your ${publicConfig.NEXT_PUBLIC_APP_SHORT_NAME} verification code is ${code}. It expires in 10 minutes.`,
      });
    } catch (error) {
      await db.from("email_verification_otps").delete().eq("id", data.id);
      otpId = undefined;
      throw error;
    }
    const message = delivery.fallbackUsed
      ? "The primary email provider failed. The backup provider accepted the code, but delivery is not confirmed."
      : "The primary email provider accepted your code for delivery.";
    return NextResponse.json({
      ok: true,
      message,
      delivery: {
        provider: delivery.provider,
        fallbackUsed: delivery.fallbackUsed,
      },
    });
  } catch (error) {
    console.error("request-otp", {
      name: error instanceof Error ? error.name : "unknown",
      message: error instanceof Error ? error.message : "unknown",
      otpCleanedUp: !otpId,
    });
    if (error instanceof RateLimitError)
      return NextResponse.json({ error: error.message }, { status: 429 });
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    if (error instanceof EmailDeliveryError)
      return NextResponse.json(
        { error: "Both email providers failed. Please try again shortly." },
        { status: 502 },
      );
    return NextResponse.json(
      { error: "We could not send the code. Please try again." },
      { status: 500 },
    );
  }
}
