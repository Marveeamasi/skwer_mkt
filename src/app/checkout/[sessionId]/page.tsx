import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckoutForm } from "@/components/buyer/checkout-form";
import { getPublicCampaign } from "@/features/campaigns/public-campaign";
import { publicConfig } from "@/lib/config";
export const metadata = {
  title: "Secure checkout",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ variant?: string; reward?: string; quantity?: string }>;
}) {
  const { sessionId } = await params,
    { variant, reward, quantity: quantityInput } = await searchParams,
    campaign = await getPublicCampaign(sessionId);
  const quantity = Number(quantityInput ?? "1");
  const selected = campaign?.variants.find((item) => item.id === variant);
  if (
    !campaign ||
    !variant ||
    !selected ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 20 ||
    (selected.availableQuantity != null && quantity > selected.availableQuantity)
  )
    notFound();
  return (
    <main className="public-page">
      <div className="checkout-shell">
        <header className="checkout-head">
          <Link className="brand" href={`/p/${sessionId}`}>
            <span className="brand-mark">←</span>
            {publicConfig.NEXT_PUBLIC_APP_SHORT_NAME}
          </Link>
          <span className="badge">Secure checkout</span>
        </header>
        <CheckoutForm
          campaign={campaign}
          variantId={variant}
          rewardCode={reward}
          quantity={quantity}
        />
      </div>
    </main>
  );
}
