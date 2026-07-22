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
      <nav className="shell nav" style={{position: "sticky", top: 0}} aria-label="Main navigation">
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
            Login
          </Link>
        </div>
      </nav>
      <section className="hero shell vendor-hero">
        <div className="hero-copy">
          <h1>
            Your WhatsApp customers can bring your <span>next customers.</span>
          </h1>
          <div className="hero-actions">
            <Link className="button" href="/register">
              Create my first sales link <ArrowRight size={19} />
            </Link>
            <Link className="button button-secondary" href="/how-it-works">
              See how it works
            </Link>
          </div>
        </div>
        <div
          className="seller-preview"
          aria-label="Example of what a seller receives"
        >
          <div className="trust-row">
              <span>
              <Check /> Create a sales link
            </span>
             <span>
              <Check /> Share link to customers on your chats, status and groups
            </span>
            <span>
              <Check /> Receive secure payments from customers
            </span>
            <span>
              <Check /> Automatic order recording and notifications
            </span>
            <span>
              <Check /> Your customers who bring you new customers gets rewarded
            </span>
          </div>
          <div className="preview-result">
            <Check size={18} />
            <span>
              <strong>Your #1 sales tool</strong>
              <small>Built for sellers and your customers</small>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
