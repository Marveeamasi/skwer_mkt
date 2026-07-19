import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("SKWER MKT"),
  NEXT_PUBLIC_APP_SHORT_NAME: z.string().min(1).default("SKWER"),
  NEXT_PUBLIC_APP_TAGLINE: z.string().min(1).default("One buyer can bring the next."),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.email().default("support@example.com"),
  NEXT_PUBLIC_SUPPORT_PHONE: z.string().default(""),
});

export const publicConfig = publicSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_SHORT_NAME: process.env.NEXT_PUBLIC_APP_SHORT_NAME,
  NEXT_PUBLIC_APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_SUPPORT_PHONE: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
});

export const featureFlags = {
  payments: process.env.PAYMENTS_ENABLED === "true",
  splitPayments: process.env.PAYSTACK_SPLIT_ENABLED === "true",
  rewards: process.env.REWARDS_ENABLED !== "false",
  deposits: process.env.DEPOSITS_ENABLED !== "false",
  restock: process.env.RESTOCK_REQUESTS_ENABLED !== "false",
  signupMode: process.env.SELLER_SIGNUP_MODE ?? "invite_only",
} as const;
