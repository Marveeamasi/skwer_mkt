import Link from "next/link";
import { PolicyPage } from "@/components/marketing/policy-page";
export const metadata = { title: "Terms of service" };
export default function Page() {
  return (
    <>
      <PolicyPage
        title="Terms of service"
        summary="These terms describe the software relationship between the platform, sellers and buyers."
        sections={[
          {
            title: "Platform role",
            body: "The platform provides sales-link, payment-integration, order, referral and tracking software. The seller remains responsible for product legality, description, quality, availability, fulfilment and seller policies.",
          },
          {
            title: "Fair use",
            body: "Users must not commit fraud, manipulate rewards, upload unlawful content, impersonate others, attack the service or use misleading product and scarcity claims.",
          },
          {
            title: "Payments and launch gate",
            body: "Payments are processed through Paystack-hosted checkout. Live collection remains disabled until the relevant account, seller settlement and compliance model are approved.",
          },
          {
            title: "Changes and suspension",
            body: "Campaigns or accounts may be paused for safety, prohibited products, payment risk or material breach. Sensitive actions are recorded for review.",
          },
        ]}
      />
      <div className="policy-wrap">
        <h2>Related terms</h2>
        <p>
          <Link href="/seller-terms">Seller terms</Link> ·{" "}
          <Link href="/buyer-terms">Buyer terms</Link> ·{" "}
          <Link href="/reward-terms">Reward terms</Link> ·{" "}
          <Link href="/prohibited-products">Prohibited products</Link> ·{" "}
          <Link href="/disputes">Disputes</Link>
        </p>
      </div>
    </>
  );
}
