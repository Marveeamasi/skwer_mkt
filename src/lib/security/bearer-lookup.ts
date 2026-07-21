import "server-only";
import { headers } from "next/headers";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function enforceBearerLookupLimit(scope: string) {
  const values = await headers();
  const forwarded = values.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = forwarded || values.get("x-real-ip") || "unknown";

  await enforceRateLimit({
    scope,
    identifier,
    limit: 60,
    windowSeconds: 600,
  });
}
