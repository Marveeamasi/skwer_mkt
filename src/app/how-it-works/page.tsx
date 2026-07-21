import Link from "next/link";
import {
  ArrowRight,
  Check,
  PackagePlus,
  Share2,
  ShoppingBag,
} from "lucide-react";
import { publicConfig } from "@/lib/config";
import styles from "./how-it-works.module.css";
export const metadata = { title: "How it works" };
const steps = [
  {
    Icon: PackagePlus,
    kicker: "Step 1",
    title: "Add your products",
    text: "Enter the product, options, stock and how much you need to receive.",
  },
  {
    Icon: Share2,
    kicker: "Step 2",
    title: "Share your sales link",
    text: "Use it on WhatsApp Status, groups or private chats.",
  },
  {
    Icon: ShoppingBag,
    kicker: "Step 3",
    title: "Fulfil paid orders",
    text: "SKWER records the buyer, payment, selected item and what happens next.",
  },
];
export default function Page() {
  return (
    <main className={`public-page ${styles.page}`}>
      <nav className="public-nav shell">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden>
            ↗
          </span>
          {publicConfig.NEXT_PUBLIC_APP_NAME}
        </Link>
        <Link className="button button-small" href="/register">
          Create sales link
        </Link>
      </nav>
      <header className={styles.hero}>
        <span className="eyebrow">How SKWER works</span>
        <h1>Create a smart sales link in three steps.</h1>
        <p>
          Add what you sell, share the link on WhatsApp, then manage verified
          orders in one place.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/register">
            Create my first sales link <ArrowRight size={18} />
          </Link>
        </div>
      </header>
      <section className={styles.flow} aria-label="Three setup steps">
        {steps.map(({ Icon, kicker, title, text }, index) => (
          <div key={title} className={styles.stage}>
            <div className={styles.copy}>
              <span>{kicker}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div className={styles.simpleCard}>
              <Icon />
              <strong>{title}</strong>
              {index === 0 && (
                <>
                  <span>Product name</span>
                  <span>Price and stock</span>
                </>
              )}
              {index === 1 && (
                <>
                  <span>Your sales link</span>
                  <button>Copy and share</button>
                </>
              )}
              {index === 2 && (
                <>
                  <span>
                    <Check size={14} /> Payment verified
                  </span>
                  <span>
                    <Check size={14} /> Order ready to fulfil
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </section>
      <section className={styles.assurance}>
        <h2>Buyers get a simple path</h2>
        <p>
          They open the link → choose what they want and pay → After a completed
          referral sale → the original buyer can earn seller-specific credit.
        </p>
        <Link className="button" href="/register">
          Create my first sales link <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
