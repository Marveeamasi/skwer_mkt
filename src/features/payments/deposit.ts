import { kobo, type Kobo } from "@/lib/money";
export function depositDue(
  totalKobo: number,
  mode: "full" | "fixed_deposit" | "percentage_deposit",
  value?: number,
): Kobo {
  if (mode === "full") return kobo(totalKobo);
  if (!value || value <= 0) throw new RangeError("Deposit value is required");
  if (mode === "fixed_deposit") return kobo(Math.min(totalKobo, value));
  if (value > 10000)
    throw new RangeError("Percentage basis points cannot exceed 10000");
  return kobo(Math.ceil((totalKobo * value) / 10000));
}
