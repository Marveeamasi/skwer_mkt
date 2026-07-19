import { z } from "zod";

const email = z.object({ to: z.email(), subject: z.string().min(1).max(160), html: z.string().min(1), text: z.string().optional() });

export async function sendTransactionalEmail(input: z.input<typeof email>): Promise<void> {
  const payload = email.parse(input);
  const url = process.env.EMAIL_SERVICE_URL;
  const secret = process.env.EMAIL_SERVICE_SECRET;
  if (!url || !secret) throw new Error("Transactional email service is not configured");
  const configured = new URL(url);
  if (configured.pathname === "/" || configured.pathname === "") configured.pathname = "/api/send";
  const response = await fetch(configured, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, secret }), signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    const provider = await response.json().catch(() => null) as {error?:string}|null;
    throw new EmailDeliveryError(provider?.error ?? `Email provider returned ${response.status}`, response.status);
  }
}

export class EmailDeliveryError extends Error {
  constructor(message:string,public readonly providerStatus:number){super(message);this.name="EmailDeliveryError"}
}
