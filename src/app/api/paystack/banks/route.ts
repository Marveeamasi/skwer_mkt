import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listNigerianBanks } from "@/lib/paystack/client";

export async function GET() {
  try {
    const db = await createClient();
    const { data } = await db.auth.getClaims();
    if (!data?.claims?.sub) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    return NextResponse.json(
      { banks: await listNigerianBanks() },
      { headers: { "cache-control": "private, max-age=3600" } },
    );
  } catch (error) {
    console.error("paystack-banks", error);
    return NextResponse.json(
      { error: "Banks could not be loaded. Please try again." },
      { status: 502 },
    );
  }
}
