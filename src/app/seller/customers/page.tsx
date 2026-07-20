import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/money";
interface Order {
  customer_id: string;
  total_paid_kobo: number;
  referred_by_referral_id: string | null;
  customer: { full_name: string } | { full_name: string }[];
  items: { variant_snapshot: Record<string, string> }[];
}
export default async function Page() {
  const db = await createClient(),
    { data } = await db
      .from("orders")
      .select(
        "customer_id,total_paid_kobo,referred_by_referral_id,customer:customers(full_name),items:order_items(variant_snapshot)",
      )
      .in("status", [
        "paid",
        "confirmed",
        "processing",
        "awaiting_stock",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "picked_up",
        "refund_pending",
        "partially_refunded",
      ]),
    customers = new Map<
      string,
      {
        name: string;
        orders: number;
        paid: number;
        referred: number;
        preferences: Set<string>;
      }
    >();
  for (const raw of (data ?? []) as unknown as Order[]) {
    const customer = Array.isArray(raw.customer)
        ? raw.customer[0]
        : raw.customer,
      current = customers.get(raw.customer_id) ?? {
        name: customer?.full_name ?? "Customer",
        orders: 0,
        paid: 0,
        referred: 0,
        preferences: new Set<string>(),
      };
    current.orders++;
    current.paid += Number(raw.total_paid_kobo);
    if (raw.referred_by_referral_id) current.referred++;
    for (const item of raw.items ?? []) {
      const values = Object.values(item.variant_snapshot ?? {}).filter(Boolean);
      if (values.length) current.preferences.add(values.join(" / "));
    }
    customers.set(raw.customer_id, current);
  }
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>Customers</h1>
          <p>
            Private to your business and based only on real completed purchases.
          </p>
        </div>
      </header>
      <section className="panel">
        {customers.size ? (
          <div className="table-wrap" data-horizontal-scroll>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Orders</th>
                  <th>Total paid</th>
                  <th>Referred purchases</th>
                  <th>Actual preferences</th>
                </tr>
              </thead>
              <tbody>
                {[...customers].map(([id, row]) => (
                  <tr key={id}>
                    <td>
                      <strong>{row.name}</strong>
                    </td>
                    <td>{row.orders}</td>
                    <td>{formatNaira(row.paid)}</td>
                    <td>{row.referred}</td>
                    <td>
                      {[...row.preferences].slice(0, 3).join(", ") ||
                        "Not recorded"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No completed customers yet</h2>
            <p>
              Customer history appears only after a verified order, so
              preferences are never guessed.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
