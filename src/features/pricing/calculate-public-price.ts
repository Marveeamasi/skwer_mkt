import { kobo, roundUp, type Kobo } from "@/lib/money";

export interface FeeConfig {
  paystackPercentBasisPoints: number;
  paystackFixedKobo: number;
  paystackFixedThresholdKobo: number;
  paystackCapKobo: number;
  platformPercentBasisPoints: number;
  platformFlatKobo: number;
  platformMinKobo: number;
  platformMaxKobo: number | null;
  safetyBufferKobo: number;
  roundingIncrementKobo: number;
}

export interface PricingResult {
  publicPriceKobo: Kobo;
  sellerTakeHomeKobo: Kobo;
  rewardFundingKobo: Kobo;
  estimatedPaystackFeeKobo: Kobo;
  platformRevenueKobo: Kobo;
  safetyBufferKobo: Kobo;
}

export function estimatePaystackFee(gross: number, config: FeeConfig): Kobo {
  const percentage = Math.ceil(
    (gross * config.paystackPercentBasisPoints) / 10_000,
  );
  const fixed =
    gross >= config.paystackFixedThresholdKobo ? config.paystackFixedKobo : 0;
  return kobo(Math.min(percentage + fixed, config.paystackCapKobo));
}

export function platformFee(sellerMinimum: number, config: FeeConfig): Kobo {
  const calculated =
    Math.ceil((sellerMinimum * config.platformPercentBasisPoints) / 10_000) +
    config.platformFlatKobo;
  return kobo(
    Math.min(
      Math.max(calculated, config.platformMinKobo),
      config.platformMaxKobo ?? Number.MAX_SAFE_INTEGER,
    ),
  );
}

export function calculatePublicPrice(
  sellerMinimum: number,
  reward: number,
  config: FeeConfig,
): PricingResult {
  kobo(sellerMinimum);
  kobo(reward);
  kobo(config.safetyBufferKobo);
  const platform = platformFee(sellerMinimum, config);
  const requiredAfterProcessor =
    sellerMinimum + reward + platform + config.safetyBufferKobo;
  let gross = roundUp(requiredAfterProcessor, config.roundingIncrementKobo);
  let fee = estimatePaystackFee(gross, config);
  let iterations = 0;
  while (gross - fee < requiredAfterProcessor) {
    gross = kobo(gross + config.roundingIncrementKobo);
    fee = estimatePaystackFee(gross, config);
    if (++iterations > 100_000)
      throw new Error("Unable to converge on a valid public price");
  }
  return {
    publicPriceKobo: gross,
    sellerTakeHomeKobo: kobo(sellerMinimum),
    rewardFundingKobo: kobo(reward),
    estimatedPaystackFeeKobo: fee,
    platformRevenueKobo: platform,
    safetyBufferKobo: kobo(config.safetyBufferKobo),
  };
}
