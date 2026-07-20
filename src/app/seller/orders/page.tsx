import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { formatNaira } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";
interface OrderRow {
  id: string;
  public_reference: string;
  status: string;
  total_paid_kobo: number;
  customer: { full_name: string } | { full_name: string }[] | null;
  campaign:
    | { product: { name: string } | { name: string }[] | null }
    | { product: { name: string } | { name: string }[] | null }[]
    | null;
}
export default async function Page() {
  const db = await createClient(),
    { data } = await db
      .from("orders")
      .select(
        "id,public_reference,status,total_paid_kobo,customer:customers(full_name),campaign:campaigns(product:products(name))",
      )
      .order("created_at", { ascending: false }),
    orders = (data ?? []) as unknown as OrderRow[];
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>Orders</h1>
          <p>Verified payment, variants and fulfilment in one place.</p>
        </div>
        <Link
          className="button button-small button-secondary"
          href="/api/seller/orders/export"
        >
          Export CSV
        </Link>
      </header>
      <section className="panel">
        <div className="form-between">
          <input
            className="app-input"
            placeholder="Search name, phone or reference"
            aria-label="Search orders"
          />
          <select className="app-input" aria-label="Filter status">
            <option>All statuses</option>
            <option>Paid</option>
            <option>Processing</option>
            <option>Ready for pickup</option>
          </select>
        </div>
        {orders.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Buyer</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const customer = Array.isArray(o.customer)
                      ? o.customer[0]
                      : o.customer,
                    campaign = Array.isArray(o.campaign)
                      ? o.campaign[0]
                      : o.campaign,
                    product = Array.isArray(campaign?.product)
                      ? campaign?.product[0]
                      : campaign?.product;
                  return (
                    <tr key={o.id}>
                      <td>{o.public_reference}</td>
                      <td>
                        <strong>{customer?.full_name ?? "Buyer"}</strong>
                      </td>
                      <td>{product?.name ?? "Product"}</td>
                      <td>
                        <span className="badge">
                          {o.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>{formatNaira(Number(o.total_paid_kobo))}</td>
                      <td>
                        <Link href={`/seller/orders/${o.id}`}>Open →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <ReceiptText size={38} />
            <h2>No orders yet</h2>
            <p>Your sales links are ready to share on WhatsApp Status.</p>
          </div>
        )}
      </section>
    </>
  );
}
