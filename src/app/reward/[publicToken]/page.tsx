import Link from "next/link";
import { notFound } from "next/navigation";
import { Gift, Share2 } from "lucide-react";
import { formatNaira } from "@/lib/money";
import { hashToken } from "@/lib/security/tokens";
import { createAdminClient } from "@/lib/supabase/admin";
export const metadata = {
  title: "Buyer reward",
  robots: { index: false, follow: false },
};
interface Reward {
  amount_kobo: number;
  status: string;
  expires_at: string;
  seller: { business_name: string } | { business_name: string }[];
  source:
    | { campaign: { short_code: string } | { short_code: string }[] }
    | { campaign: { short_code: string } | { short_code: string }[] }[];
}
export default async function Page({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params,
    { data } = await createAdminClient()
      .from("reward_credits")
      .select(
        "amount_kobo,status,expires_at,seller:seller_businesses(business_name),source:orders(campaign:campaigns(short_code))",
      )
      .eq("public_code_hash", hashToken(publicToken))
      .single();
  if (!data) notFound();
  const r = data as unknown as Reward,
    seller = Array.isArray(r.seller) ? r.seller[0] : r.seller,
    source = Array.isArray(r.source) ? r.source[0] : r.source,
    campaign = Array.isArray(source?.campaign)
      ? source.campaign[0]
      : source?.campaign;
  return (
    <main className="public-page">
      <div className="checkout-shell">
        <section className="checkout-card empty-state">
          <Gift size={54} color="#15803d" />
          <span className="badge">{r.status}</span>
          <h1>{formatNaira(Number(r.amount_kobo))} off your next order</h1>
          <p>
            This reward is store credit from {seller?.business_name}. It is
            single-use, non-transferable, non-withdrawable and expires{" "}
            {new Date(r.expires_at).toLocaleDateString("en-NG")}.
          </p>
          <div className="hero-actions">
            {campaign && (
              <Link
                className="button"
                href={`/p/${campaign.short_code}?reward=${encodeURIComponent(publicToken)}`}
              >
                Use this reward
              </Link>
            )}
            <button className="button button-secondary">
              <Share2 size={17} /> Share product again
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
