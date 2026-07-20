import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { sendTransactionalEmail } from "@/lib/email/client";

const originalEnv = { ...process.env };

describe("transactional email delivery", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...originalEnv,
      EMAIL_PROVIDER: "emailjs",
      EMAILJS_SERVICE_ID: "service",
      EMAILJS_TEMPLATE_ID: "template",
      EMAILJS_PUBLIC_KEY: "public",
      EMAILJS_PRIVATE_KEY: "",
      EMAIL_FROM_NAME: "SKWER MKT",
      EMAIL_REPLY_TO: "help@example.com",
    };
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("sends one generic EmailJS template with dynamic text and subject", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("OK", { status: 200 }));
    await sendTransactionalEmail({
      to: "buyer@example.com",
      subject: "Your verification code",
      html: "<p>Code: 123456</p>",
      text: "Your verification code is 123456. It expires in 10 minutes.",
    });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.emailjs.com/api/v1.0/email/send");
    const body = JSON.parse(String(options?.body));
    expect(body).toEqual({
      service_id: "service",
      template_id: "template",
      user_id: "public",
      template_params: {
        to: "buyer@example.com",
        to_email: "buyer@example.com",
        subject: "Your verification code",
        text: "Your verification code is 123456. It expires in 10 minutes.",
        from_name: "SKWER MKT",
        reply_to: "help@example.com",
      },
    });
  });

  it("includes the optional EmailJS private access token when configured", async () => {
    process.env.EMAILJS_PRIVATE_KEY = "private";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("OK", { status: 200 }));
    await sendTransactionalEmail({
      to: "buyer@example.com",
      subject: "Update",
      html: "<p>Update</p>",
      text: "Update",
    });
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.accessToken).toBe("private");
  });

  it("reports when the configured provider fails and the backup accepts the email", async () => {
    process.env.EMAIL_SERVICE_URL = "https://mailer.example.com/api/send";
    process.env.EMAIL_SERVICE_SECRET = "secret";
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response("Non-browser access disabled", { status: 403 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    const result = await sendTransactionalEmail({
      to: "buyer@example.com",
      subject: "Code",
      html: "<p>123456</p>",
      text: "Code: 123456",
    });
    expect(result).toEqual({ provider: "vercel", fallbackUsed: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
