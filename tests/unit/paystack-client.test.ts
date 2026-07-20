import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { initializePaystack } from "@/lib/paystack/client";

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
