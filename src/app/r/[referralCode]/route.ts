import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
import { signValue } from "@/lib/security/signed-value";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
import { publicConfig } from "@/lib/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ referralCode: string }> },
) {
  try {
    await enforceRateLimit({
      scope: "referral_resolve",
      identifier: requestIdentifier(request),
      limit: 30,
      windowSeconds: 600,
    });
    const { referralCode } = await params;
    if (!/^[A-Za-z0-9_-]{6,64}$/.test(referralCode))
      return NextResponse.redirect(new URL("/?referral=invalid", request.url));
    let campaignCode = "GLAM-PH-01",
      expires = new Date(Date.now() + 14 * 86400000);
    if (isSupabaseConfigured()) {
      const { data } = await createAdminClient()
        .from("referral_links")
        .select(
          "public_code,status,attribution_expires_at,campaign:campaigns(short_code)",
        )
        .eq("public_code", referralCode)
        .eq("status", "active")
        .gt("attribution_expires_at", new Date().toISOString())
        .maybeSingle();
      if (!data)
        return NextResponse.redirect(
          new URL("/?referral=invalid", request.url),
        );
      const campaign = Array.isArray(data.campaign)
        ? data.campaign[0]
        : data.campaign;
      if (!campaign?.short_code)
        return NextResponse.redirect(
          new URL("/?referral=invalid", request.url),
        );
      campaignCode = campaign.short_code;
      expires = new Date(data.attribution_expires_at);
    }
    const response = NextResponse.redirect(
      new URL(`/p/${campaignCode}`, publicConfig.NEXT_PUBLIC_APP_URL),
    );
    const secret = process.env.REFERRAL_TOKEN_SECRET;
    if (!secret)
      return NextResponse.redirect(
        new URL("/?referral=unavailable", request.url),
      );
    response.cookies.set("skwer_referral", signValue(referralCode, secret), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires,
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof RateLimitError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.redirect(new URL("/?referral=invalid", request.url));
  }
}
