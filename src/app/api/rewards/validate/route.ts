import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken } from "@/lib/security/tokens";
import { normalizeNigerianPhone } from "@/lib/security/phone";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";
import { validateReward } from "@/features/rewards/rules";

const schema = z.object({
  code: z.string().min(8).max(100),
  sellerId: z.uuid(),
  phone: z.string().min(10).max(24),
  subtotalKobo: z.number().int().positive().max(100_000_000),
  hasReferral: z.boolean(),
});

export async function POST(request: Request) {
  try {
    await enforceRateLimit({
      scope: "reward_validate",
      identifier: requestIdentifier(request),
      limit: 10,
      windowSeconds: 600,
    });
    const input = schema.parse(await request.json());
    const db = createAdminClient();
    const { data: reward } = await db
      .from("reward_credits")
      .select("*,owner:customers(normalized_phone)")
      .eq("public_code_hash", hashToken(input.code))
      .maybeSingle();
    if (!reward)
      return NextResponse.json(
        { valid: false, reason: "Reward code was not found" },
        { status: 404 },
      );
    const owner = Array.isArray(reward.owner) ? reward.owner[0] : reward.owner;
    if (!owner)
      return NextResponse.json(
        { valid: false, reason: "Reward could not be checked" },
        { status: 400 },
      );
    const result = validateReward({
      reward: {
        sellerId: reward.seller_id,
        ownerPhone: owner.normalized_phone,
        amountKobo: Number(reward.amount_kobo),
        status: reward.status,
        expiresAt: reward.expires_at ? new Date(reward.expires_at) : null,
      },
      sellerId: input.sellerId,
      buyerPhone: normalizeNigerianPhone(input.phone),
      orderSubtotalKobo: input.subtotalKobo,
      hasReferral: input.hasReferral,
    });
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    if (error instanceof RateLimitError)
      return NextResponse.json(
        { valid: false, reason: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      { valid: false, reason: "Reward could not be checked" },
      { status: 400 },
    );
  }
}
