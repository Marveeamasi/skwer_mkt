export type Kobo = number & { readonly __brand: "Kobo" };

export function kobo(value: number): Kobo {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new RangeError("Money must be a non-negative safe integer in kobo");
  return value as Kobo;
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export function roundUp(value: number, increment: number): Kobo {
  if (!Number.isSafeInteger(increment) || increment <= 0)
    throw new RangeError("Rounding increment must be positive");
  return kobo(Math.ceil(value / increment) * increment);
}
