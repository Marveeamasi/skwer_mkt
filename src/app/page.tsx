import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  PackagePlus,
  Share2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { publicConfig } from "@/lib/config";

const steps = [
  [
    PackagePlus,
    "Add what you sell",
    "Create products with their prices, options and available stock.",
  ],
  [
    Share2,
    "Share your sales link",
    "Post it on Status, groups and customer chats.",
  ],
  [
    ShoppingBag,
    "Receive organised orders",
    "Buyers choose and pay; you see the order and what to fulfil.",
  ],
] as const;

export default function Home() {
  return (
    <main>
      <nav className="shell nav" aria-label="Main navigation">
        <Link
          className="brand"
          href="/"
          aria-label={`${publicConfig.NEXT_PUBLIC_APP_NAME} home`}
        >
          <span className="brand-mark" aria-hidden>
            ↗
          </span>
          {publicConfig.NEXT_PUBLIC_APP_NAME}
        </Link>
        <div className="nav-actions">
          <Link className="text-link" href="/how-it-works">
            How it works
          </Link>
          <Link className="button button-small button-secondary" href="/login">
            Seller login
          </Link>
        </div>
      </nav>
      <section className="hero shell vendor-hero">
        <div className="hero-copy">
          <span className="eyebrow">Built for WhatsApp sellers</span>
          <h1>
            Your WhatsApp customers can bring your <span>next customers.</span>
          </h1>
          <p className="lede">
            Create a smart product link, receive secure payments, record every
            order and reward buyers who create real sales.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/register">
              Create my first sales link <ArrowRight size={19} />
            </Link>
            <Link className="button button-secondary" href="/how-it-works">
              See how it works
            </Link>
          </div>
          <div className="trust-row">
            <span>
              <BadgeCheck /> No monthly fee
            </span>
            <span>
              <ShieldCheck /> Paystack checkout
            </span>
            <span>
              <Check /> Buyers need no account
            </span>
          </div>
        </div>
        <div
          className="seller-preview"
          aria-label="Example of what a seller receives"
        >
          <div className="seller-preview-head">
            <span className="seller-avatar">AM</span>
            <div>
              <small>Your sales link</small>
              <strong>Amara Beauty</strong>
            </div>
            <span className="badge">Ready to share</span>
          </div>
          <div className="preview-link">
            skwer-mkt.vercel.app/s/amara-beauty
          </div>
          <div className="preview-products">
            <article>
              <i className="preview-art coral" />
              <div>
                <strong>Soft Glam Set</strong>
                <small>3 options · In stock</small>
              </div>
            </article>
            <article>
              <i className="preview-art lime" />
              <div>
                <strong>Lip Care Bundle</strong>
                <small>2 options · In stock</small>
              </div>
            </article>
          </div>
          <div className="preview-result">
            <Check size={18} />
            <span>
              <strong>Add one product or a few.</strong>
              <small>Share the link when you are ready.</small>
            </span>
          </div>
        </div>
      </section>
      <section className="how">
        <div className="shell">
          <span className="eyebrow">Simple from the first sale</span>
          <h2 className="section-title">
            From WhatsApp post to confirmed order.
          </h2>
          <div className="steps">
            {steps.map(([Icon, title, text], index) => (
              <article className="step" key={title}>
                <span>0{index + 1}</span>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="seller-value shell">
        <div>
          <span className="eyebrow">Start with what you have</span>
          <h2 className="section-title">One product or several, you decide.</h2>
        </div>
        <div>
          <p>
            Create a focused link for one product, or share your multi-product
            sales link when buyers need choices.
          </p>
          <Link className="button" href="/register">
            Start free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
