import { z } from "zod";

const email = z.object({ to: z.email(), subject: z.string().min(1).max(160), html: z.string().min(1), text: z.string().optional() });

export async function sendTransactionalEmail(input: z.input<typeof email>): Promise<void> {
  const payload = email.parse(input);
  const url = process.env.EMAIL_SERVICE_URL;
  const secret = process.env.EMAIL_SERVICE_SECRET;
  if (!url || !secret) throw new Error("Transactional email service is not configured");
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, secret }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Transactional email failed with status ${response.status}`);
}
