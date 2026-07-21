import "server-only";
import { z } from "zod";
const initialized = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    authorization_url: z.url(),
    access_code: z.string(),
    reference: z.string(),
  }),
});
const verified = z.object({
  status: z.boolean(),
  data: z.object({
    status: z.string(),
    reference: z.string(),
    amount: z.number().int(),
    currency: z.string(),
    id: z.number(),
    channel: z.string().nullable(),
    paid_at: z.string().nullable(),
  }),
});
async function call(path: string, init?: RequestInit) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Paystack test key is not configured");
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Paystack request failed");
  return body;
}
export async function initializePaystack(input: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  subaccount?: string;
  transactionCharge?: number;
  metadata: Record<string, unknown>;
}) {
  const body: Record<string, unknown> = {
    email: input.email,
    amount: input.amount,
    reference: input.reference,
    callback_url: input.callbackUrl,
    channels: ["card", "bank", "bank_transfer", "ussd"],
    metadata: input.metadata,
  };
  if (input.subaccount) {
    body.subaccount = input.subaccount;
    body.bearer = "account";
    if (input.transactionCharge != null)
      body.transaction_charge = input.transactionCharge;
  }
  return initialized.parse(
    await call("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}
export async function verifyPaystack(reference: string) {
  return verified.parse(
    await call(`/transaction/verify/${encodeURIComponent(reference)}`),
  );
}
const refundCreated = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z
    .object({
      id: z.union([z.number(), z.string()]),
      amount: z.number().int(),
      currency: z.string(),
      status: z.string(),
    })
    .passthrough(),
});
export async function createPaystackRefund(input: {
  transaction: string;
  amount: number;
  customerNote: string;
  merchantNote: string;
}) {
  return refundCreated.parse(
    await call("/refund", {
      method: "POST",
      body: JSON.stringify({
        transaction: input.transaction,
        amount: input.amount,
        currency: "NGN",
        customer_note: input.customerNote,
        merchant_note: input.merchantNote,
      }),
    }),
  );
}

const banksResponse = z.object({
  status: z.boolean(),
  data: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
      active: z.boolean(),
      currency: z.string(),
      country: z.string(),
    }),
  ),
});

const resolvedAccount = z.object({
  status: z.boolean(),
  data: z.object({
    account_number: z.string(),
    account_name: z.string(),
  }),
});

const subaccountCreated = z.object({
  status: z.boolean(),
  data: z.object({
    subaccount_code: z.string(),
    account_name: z.string(),
    is_verified: z.boolean().optional().default(false),
  }),
});

export async function listNigerianBanks() {
  const result = banksResponse.parse(
    await call("/bank?country=nigeria&currency=NGN&perPage=100"),
  );
  return result.data
    .filter((bank) => bank.active && bank.currency === "NGN")
    .map(({ name, code }) => ({ name, code }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function resolvePaystackAccount(input: {
  accountNumber: string;
  bankCode: string;
}) {
  return resolvedAccount.parse(
    await call(
      `/bank/resolve?account_number=${encodeURIComponent(input.accountNumber)}&bank_code=${encodeURIComponent(input.bankCode)}`,
    ),
  ).data;
}

export async function createPaystackSubaccount(input: {
  businessName: string;
  bankCode: string;
  accountNumber: string;
  email: string;
  phone: string;
}) {
  return subaccountCreated.parse(
    await call("/subaccount", {
      method: "POST",
      body: JSON.stringify({
        business_name: input.businessName,
        settlement_bank: input.bankCode,
        account_number: input.accountNumber,
        percentage_charge: 0,
        description: `${input.businessName} seller settlement account`,
        primary_contact_email: input.email,
        primary_contact_phone: input.phone,
      }),
    }),
  ).data;
}
