import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { formatNaira } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";
import { ShareAction } from "@/components/shared/share-actions";
interface CampaignRow {
  id: string;
  short_code: string;
  status: string;
  public_price_kobo: number;
  product: { name: string } | { name: string }[] | null;
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; image?: string }>;
}) {
  const query = await searchParams;
  const db = await createClient(),
    [{ data }, { data: business }] = await Promise.all([
      db
        .from("campaigns")
        .select("id,short_code,status,public_price_kobo,product:products(name)")
        .order("created_at", { ascending: false }),
      db.from("seller_businesses").select("business_name,slug").maybeSingle(),
    ]),
    rows = (data ?? []) as unknown as CampaignRow[];
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>Sales links</h1>
          <p>Create, share and manage one product at a time.</p>
        </div>
        <div className="app-top-actions">
          {business && rows.length > 1 && (
            <ShareAction
              url={`/s/${business.slug}`}
              title={`Products from ${business.business_name}`}
              text={`Choose and order from ${business.business_name}.`}
              label="Share products together"
            />
          )}
          <Link className="button button-small" href="/seller/campaigns/new">
            <PackagePlus size={17} /> Add product
          </Link>
        </div>
      </header>
      {query.created && (
        <p className="notice" role="status">
          Sales link <strong>/p/{query.created}</strong> was published.
          {query.image === "failed"
            ? " Its image did not upload, so the link is using a safe placeholder. You can still share it."
            : " It is ready to share."}
        </p>
      )}
      {rows.length ? (
        <section className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Buyer sees</th>
                <th>Sales link</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const p = Array.isArray(r.product) ? r.product[0] : r.product;
                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{p?.name ?? "Unnamed product"}</strong>
                    </td>
                    <td>
                      <span className="badge">
                        {r.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>{formatNaira(Number(r.public_price_kobo))}</td>
                    <td>
                      <Link href={`/p/${r.short_code}`}>/p/{r.short_code}</Link>
                    </td>
                    <td>
                      <Link href={`/seller/campaigns/${r.id}`}>Manage →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="panel empty-state">
          <PackagePlus size={38} />
          <h2>No sales links yet</h2>
          <p>Add one product and share it on WhatsApp today.</p>
          <Link className="button button-small" href="/seller/campaigns/new">
            Create sales link
          </Link>
        </section>
      )}
    </>
  );
}
