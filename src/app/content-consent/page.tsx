import { PolicyPage } from "@/components/marketing/policy-page";
export default function Page() {
  return (
    <PolicyPage
      title="Content and customer-photo consent"
      summary="Sellers must have permission before publishing customer photographs or testimonials."
      sections={[
        {
          title: "Seller confirmation",
          body: "Upload only content you own or are authorised to use. Record genuine consent, accurate context and accessible alt text. Do not reveal private chats, addresses or sensitive personal data.",
        },
        {
          title: "Removal",
          body: "A person shown may report or request review of content. The platform may hide content during verification and preserve limited evidence for safety and disputes.",
        },
      ]}
    />
  );
}
