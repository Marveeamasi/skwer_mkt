import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MessageCircle, ShoppingBag } from "lucide-react";
import { getPublicStorefront } from "@/features/storefront/public-storefront";
import { formatNaira } from "@/lib/money";
import { publicConfig } from "@/lib/config";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    store = await getPublicStorefront(slug);
  if (!store) return {};
  return {
    title: `Products from ${store.seller.businessName}`,
    description: `Choose a product from ${store.seller.businessName} and pay securely.`,
    alternates: { canonical: `/s/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    store = await getPublicStorefront(slug);
  if (!store) notFound();
  return (
    <main className="public-page">
      <nav className="public-nav shell">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden>
            ↗
          </span>
          {publicConfig.NEXT_PUBLIC_APP_SHORT_NAME}
        </Link>
        <div className="seller-chip">
          <span>{store.seller.businessName.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{store.seller.businessName}</strong>
            <br />
            <small>
              {store.seller.city}
              {store.seller.paymentVerified
                ? " · Verified payment account"
                : ""}
            </small>
          </div>
        </div>
      </nav>
      <header className="storefront-head shell">
        <span className="eyebrow">
          Products from {store.seller.businessName}
        </span>
        <h1>Choose what you want</h1>
        <p>{store.seller.description}</p>
      </header>
      {store.campaigns.length ? (
        <section className="storefront-grid shell">
          {store.campaigns.map((product) => (
            <article className="storefront-card" key={product.id}>
              <Link
                className="storefront-image"
                href={`/p/${product.shortCode}`}
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt || product.name}
                    fill
                    sizes="(max-width: 620px) 50vw, 300px"
                    unoptimized
                  />
                ) : (
                  <span>{product.name}</span>
                )}
              </Link>
              <div className="storefront-body">
                <small>{product.category}</small>
                <h2>{product.name}</h2>
                <strong>{formatNaira(product.priceKobo)}</strong>
                <span className={product.available ? "stock-ok" : "stock-out"}>
                  {product.available ? "Available" : "Currently unavailable"}
                </span>
                <Link
                  className="button button-small"
                  href={`/p/${product.shortCode}`}
                >
                  {product.available ? "Choose options" : "View product"}
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="panel empty-state storefront-empty">
          <ShoppingBag size={38} />
          <h2>No products available yet</h2>
          <p>Check again after the seller adds products.</p>
        </section>
      )}
      <footer className="storefront-help shell">
        <BadgeCheck size={18} />
        <span>
          Payments are verified by SKWER through Paystack. You do not need an
          account.
        </span>
        <a href={`https://wa.me/${store.seller.whatsappPhone}`}>
          <MessageCircle size={17} /> Ask the seller
        </a>
      </footer>
    </main>
  );
}
