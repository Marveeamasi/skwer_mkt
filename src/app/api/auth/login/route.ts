import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { requestIdentifier } from "@/lib/security/request";

const schema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(72),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.trim().toLowerCase();

    await enforceRateLimit({
      scope: "password-login",
      identifier: `${requestIdentifier(request)}:${email}`,
      limit: 8,
      windowSeconds: 900,
    });

    const db = await createClient();
    const { error } = await db.auth.signInWithPassword({
      email,
      password: input.password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Email or password is incorrect." },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 },
      );
    }
    console.error("password-login", error);
    return NextResponse.json(
      { error: "Sign in is temporarily unavailable." },
      { status: 503 },
    );
  }
}
