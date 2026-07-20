import { PolicyPage } from "@/components/marketing/policy-page";
export const metadata = { title: "Privacy policy" };
export default function Page() {
  return (
    <PolicyPage
      title="Privacy policy"
      summary="We process only the buyer, seller, order, payment and security information needed to operate trustworthy sales links."
      sections={[
        {
          title: "Information we process",
          body: "Names, contact details, delivery information, seller business information, order history, payment references, consent records, and limited device or security signals. We do not store card details.",
        },
        {
          title: "Why we use it",
          body: "To create and fulfil orders, verify payments, prevent fraud, provide support, maintain legal records and improve first-party product performance. A purchase does not automatically consent a buyer to platform marketing.",
        },
        {
          title: "Sharing and isolation",
          body: "Sellers see only their own customer relationships. Paystack processes checkout data. Infrastructure providers process data under service arrangements. We do not sell customer contact lists or expose cross-seller profiles.",
        },
        {
          title: "Retention and control",
          body: "Order and payment records follow legal and accounting retention needs. Abandoned checkout data is removed or anonymised within the documented 30–90 day window. Restock requests close after fulfilment or inactivity. People may request access, correction, objection or deletion where legally possible.",
        },
      ]}
    />
  );
}
