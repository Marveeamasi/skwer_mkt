import { PolicyPage } from "@/components/marketing/policy-page";
export default function Page() {
  return (
    <PolicyPage
      title="Referral reward terms"
      summary="Rewards recognise genuine new paid orders; they are not cash wallets."
      sections={[
        {
          title: "Qualification",
          body: "Clicks and shares do not earn rewards. A distinct buyer must complete full payment through a valid attribution and the order must reach the configured fulfilment or confirmation event.",
        },
        {
          title: "Use and expiry",
          body: "Credit is seller-specific, single-use, non-transferable, non-withdrawable and normally expires 60 days after availability. The earning phone number must match at redemption.",
        },
        {
          title: "Fairness and fraud",
          body: "Reward stacking is not allowed. A discounted redemption order does not create another reward in Version 1. Self-referrals, refund abuse and combined fraud signals may delay, reject or reverse credit after review.",
        },
      ]}
    />
  );
}
