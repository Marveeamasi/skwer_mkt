import { describe, expect, it } from "vitest";
import { canTransition } from "@/features/orders/states";
import { depositDue } from "@/features/payments/deposit";
import { normalizeNigerianPhone } from "@/lib/security/phone";
import { validateReward, isDistinctReferral } from "@/features/rewards/rules";
import { chooseAttribution } from "@/features/referrals/attribution";
describe("orders", () => {
  it("permits fulfilment but not skipping from pending to delivered", () => {
    expect(canTransition("paid", "confirmed")).toBe(true);
    expect(canTransition("payment_pending", "delivered")).toBe(false);
  });
  it("calculates fixed and percentage deposits", () => {
    expect(depositDue(100000, "fixed_deposit", 25000)).toBe(25000);
    expect(depositDue(100000, "percentage_deposit", 3000)).toBe(30000);
  });
});
describe("identity and rewards", () => {
  it("normalizes Nigerian phone numbers", () =>
    expect(normalizeNigerianPhone("0803 123 4567")).toBe("2348031234567"));
  it("requires a distinct referred buyer", () =>
    expect(
      isDistinctReferral(
        { phone: "1", email: "a@x.com" },
        { phone: "2", email: "a@x.com" },
      ),
    ).toBe(false));
  it("blocks stacking", () =>
    expect(
      validateReward({
        reward: {
          sellerId: "s",
          ownerPhone: "1",
          amountKobo: 500,
          status: "available",
          expiresAt: null,
        },
        sellerId: "s",
        buyerPhone: "1",
        orderSubtotalKobo: 1000,
        hasReferral: true,
      }).valid,
    ).toBe(false));
});
describe("attribution", () => {
  it("cannot change after checkout starts", () => {
    const existing = { code: "A", expiresAt: new Date(Date.now() + 10000) },
      incoming = { code: "B", expiresAt: new Date(Date.now() + 10000) };
    expect(
      chooseAttribution({
        existing,
        incoming,
        checkoutStarted: true,
        explicitlyRemoved: false,
      }),
    ).toEqual(existing);
  });
});
