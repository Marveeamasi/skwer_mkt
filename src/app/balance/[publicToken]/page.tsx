import { notFound } from "next/navigation";
import { hashToken } from "@/lib/security/tokens";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/money";
import { BalancePaymentButton } from "@/components/buyer/balance-payment-button";
import { enforceBearerLookupLimit } from "@/lib/security/bearer-lookup";
export const metadata = {
  title: "Pay order balance",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;
  try { await enforceBearerLookupLimit("balance-token-lookup"); } catch { notFound(); }
  const
    { data: link } = await createAdminClient()
      .from("order_payment_links")
      .select(
        "status,expires_at,order:orders(public_reference,total_due_kobo,total_paid_kobo,customer:customers(full_name),items:order_items(product_name_snapshot))",
      )
      .eq("public_token_hash", hashToken(publicToken))
      .maybeSingle();
  if (!link) notFound();
  const order = Array.isArray(link.order) ? link.order[0] : link.order;
  if (!order) notFound();
  const customer = Array.isArray(order.customer)
      ? order.customer[0]
      : order.customer,
    item = order.items?.[0],
    outstanding = Math.max(
      0,
      Number(order.total_due_kobo) - Number(order.total_paid_kobo),
    ),
    available =
      link.status === "active" &&
      new Date(link.expires_at) > new Date() &&
      outstanding > 0;
  return (
    <main className="public-page">
      <div className="checkout-shell">
        <section className="checkout-card">
          <span className="badge">Order {order.public_reference}</span>
          <h1>Complete your balance payment</h1>
          <p>
            {customer?.full_name}, this secure link is for{" "}
            {item?.product_name_snapshot ?? "your order"}.
          </p>
          <div className="order-summary">
            <p>
              <span>Outstanding balance</span>
              <strong>{formatNaira(outstanding)}</strong>
            </p>
            <p>
              <span>Link expires</span>
              <strong>
                {new Date(link.expires_at).toLocaleString("en-NG")}
              </strong>
            </p>
          </div>
          {available ? (
            <BalancePaymentButton token={publicToken} />
          ) : (
            <p className="notice">
              This balance link is expired, revoked, or already paid. Contact
              the seller for a new link.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
