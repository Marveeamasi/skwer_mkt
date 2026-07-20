import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/money";
import { StatusForm } from "@/components/seller/status-form";
interface Row {
  id: string;
  short_code: string;
  status: string;
  public_price_kobo: number;
  seller_minimum_take_home_kobo: number;
  referral_reward_kobo: number;
  stock_mode: string;
  payment_mode: string;
  product:
    | { name: string; description: string }
    | { name: string; description: string }[];
  variants: {
    option_1_value: string;
    option_2_value: string;
    available_quantity: number;
    reserved_quantity: number;
  }[];
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params,
    db = await createClient(),
    { data } = await db
      .from("campaigns")
      .select(
        "id,short_code,status,public_price_kobo,seller_minimum_take_home_kobo,referral_reward_kobo,stock_mode,payment_mode,product:products(name,description),variants:products(product_variants(option_1_value,option_2_value,available_quantity,reserved_quantity))",
      )
      .eq("id", id)
      .single();
  if (!data) notFound();
  const c = data as unknown as Row,
    p = Array.isArray(c.product) ? c.product[0] : c.product;
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>{p.name}</h1>
          <p>
            /p/{c.short_code} · {c.stock_mode.replaceAll("_", " ")}
          </p>
        </div>
        <Link
          className="button button-small button-secondary"
          href={`/p/${c.short_code}`}
        >
          View buyer page
        </Link>
      </header>
      <div className="settings-grid">
        <section className="panel">
          <h2>Campaign status</h2>
          <StatusForm
            resource="campaigns"
            id={c.id}
            current={c.status}
            options={["active", "paused", "sold_out", "ended", "archived"]}
          />
          <h2 style={{ marginTop: 28 }}>Buyer pricing</h2>
          <div className="order-summary">
            <p>
              <span>Buyer sees</span>
              <strong>{formatNaira(Number(c.public_price_kobo))}</strong>
            </p>
            <p>
              <span>You receive at least</span>
              <strong>
                {formatNaira(Number(c.seller_minimum_take_home_kobo))}
              </strong>
            </p>
            <p>
              <span>Buyer reward</span>
              <strong>{formatNaira(Number(c.referral_reward_kobo))}</strong>
            </p>
          </div>
        </section>
        <section className="panel">
          <h2>Share</h2>
          <p>Post this link on WhatsApp Status, a group or private chat.</p>
          <input
            className="app-input"
            readOnly
            value={`${process.env.NEXT_PUBLIC_APP_URL}/p/${c.short_code}`}
          />
          <div className="hero-actions">
            <a
              className="button button-small"
              href={`https://wa.me/?text=${encodeURIComponent(`${p.name}: ${process.env.NEXT_PUBLIC_APP_URL}/p/${c.short_code}`)}`}
            >
              Share on WhatsApp
            </a>
            <button className="button button-small button-secondary">
              Copy link
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
