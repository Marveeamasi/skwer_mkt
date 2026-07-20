import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { publicConfig } from "@/lib/config";

const steps = [
  [
    "01",
    "Add one product",
    "Choose the options, stock and amount you must receive.",
  ],
  [
    "02",
    "Share it on WhatsApp",
    "Post one polished sales link on Status, groups or private chat.",
  ],
  [
    "03",
    "Sell, track and grow",
    "Payment records the order. Happy buyers can bring the next buyer.",
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
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} /> Built for WhatsApp sellers
          </span>
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
              <ShieldCheck /> Secure Paystack checkout
            </span>
            <span>
              <BadgeCheck /> No monthly fee
            </span>
            <span>
              <MessageCircle /> WhatsApp stays your front door
            </span>
          </div>
        </div>
        <div className="product-demo" aria-label="Example product sales link">
          <div className="demo-top">
            <span className="seller-avatar">AM</span>
            <div>
              <strong>Amara Beauty</strong>
              <small>Port Harcourt · Verified payment account</small>
            </div>
          </div>
          <div className="demo-photo">
            <span>Everyday glow kit</span>
          </div>
          <div className="demo-body">
            <div className="row">
              <h2>Soft Glam Set</h2>
              <strong>₦10,800</strong>
            </div>
            <p>Everything you need for an easy everyday look.</p>
            <div className="reward">
              <Sparkles size={18} />
              <span>
                Earn <strong>₦500 off</strong> your next order when a friend
                buys.
              </span>
            </div>
            <button className="button demo-buy">
              Buy now <ArrowRight size={18} />
            </button>
            <small className="secure">
              <ShieldCheck size={15} /> Secure payment powered by Paystack · No
              account required
            </small>
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
            {steps.map(([number, title, text]) => (
              <article className="step" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="seller-value shell">
        <div>
          <span className="eyebrow">
            <PackageCheck size={16} /> Quietly organised behind the scenes
          </span>
          <h2 className="section-title">More selling. Less chat-searching.</h2>
        </div>
        <p>
          Buyers choose the right size or colour, payment connects to the
          correct order, stock is reserved, and each customer gets a tracking
          link—without replacing how you already sell.
        </p>
      </section>
    </main>
  );
}
