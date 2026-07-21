import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import {
  createPaystackSubaccount,
  initializePaystack,
  listNigerianBanks,
  resolvePaystackAccount,
} from "@/lib/paystack/client";

const originalEnv = { ...process.env };
const providerResponse = {
  status: true,
  message: "Authorization URL created",
  data: { authorization_url: "https://checkout.paystack.com/test", access_code: "access", reference: "ref" },
};

describe("Paystack initialization", () => {
  beforeEach(() => { process.env = { ...originalEnv, PAYSTACK_SECRET_KEY: "sk_test_safe" }; });
  afterEach(() => { process.env = { ...originalEnv }; vi.restoreAllMocks(); });
  it("does not send split-only fields for a platform transaction", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(providerResponse), { status: 200 }));
    await initializePaystack({ email: "buyer@example.com", amount: 100000, reference: "ref", callbackUrl: "https://example.com/callback", transactionCharge: 5000, metadata: {} });
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body).not.toHaveProperty("subaccount");
    expect(body).not.toHaveProperty("transaction_charge");
    expect(body).not.toHaveProperty("bearer");
  });
  it("includes split fields only with an approved seller subaccount", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(providerResponse), { status: 200 }));
    await initializePaystack({ email: "buyer@example.com", amount: 100000, reference: "ref", callbackUrl: "https://example.com/callback", subaccount: "ACCT_test", transactionCharge: 5000, metadata: {} });
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body).toMatchObject({ subaccount: "ACCT_test", transaction_charge: 5000, bearer: "account" });
  });
});

describe("Paystack seller payment onboarding", () => {
  beforeEach(() => {
    process.env = { ...originalEnv, PAYSTACK_SECRET_KEY: "sk_test_safe" };
  });
  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("returns only active NGN banks in a stable display order", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          status: true,
          data: [
            { name: "Zenith", code: "057", active: true, currency: "NGN", country: "Nigeria" },
            { name: "Dormant", code: "000", active: false, currency: "NGN", country: "Nigeria" },
            { name: "Access", code: "044", active: true, currency: "NGN", country: "Nigeria" },
          ],
        }),
        { status: 200 },
      ),
    );
    await expect(listNigerianBanks()).resolves.toEqual([
      { name: "Access", code: "044" },
      { name: "Zenith", code: "057" },
    ]);
  });

  it("resolves the account before creating a zero-default-charge subaccount", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: true,
            data: { account_number: "0123456789", account_name: "ADA SELLER" },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: true,
            data: {
              subaccount_code: "ACCT_test",
              account_name: "ADA SELLER",
              is_verified: false,
            },
          }),
          { status: 201 },
        ),
      );

    await expect(
      resolvePaystackAccount({ accountNumber: "0123456789", bankCode: "058" }),
    ).resolves.toMatchObject({ account_name: "ADA SELLER" });
    await createPaystackSubaccount({
      businessName: "Ada Styles",
      bankCode: "058",
      accountNumber: "0123456789",
      email: "ada@example.com",
      phone: "2348030000000",
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain("/bank/resolve?");
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toMatchObject({
      business_name: "Ada Styles",
      settlement_bank: "058",
      account_number: "0123456789",
      percentage_charge: 0,
    });
  });
});
