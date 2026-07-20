"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { formatNaira } from "@/lib/money";
import type { PublicCampaign } from "@/features/campaigns/public-campaign";

export function ProductPurchase({ campaign }: { campaign: PublicCampaign }) {
  const params = useSearchParams(),
    reward = params.get("reward");
  const [variant, setVariant] = useState(campaign.variants[0]?.id);
  const selected = campaign.variants.find((item) => item.id === variant),
    soldOut = selected?.availableQuantity === 0;
  const checkoutHref = `/checkout/${campaign.shortCode}?variant=${variant}${reward ? `&reward=${encodeURIComponent(reward)}` : ""}`;
  return (
    <div className="product-info">
      <span className="eyebrow">
        {campaign.product.category} · {campaign.status.replace("_", " ")}
      </span>
      <h1>{campaign.product.name}</h1>
      <div className="product-price">
        {formatNaira(campaign.publicPriceKobo)}
      </div>
      <p className="product-description">{campaign.product.description}</p>
      {campaign.referralRewardKobo > 0 && (
        <div className="buyer-reward">
          <Sparkles size={20} />
          <span>
            Buy this and earn{" "}
            <strong>{formatNaira(campaign.referralRewardKobo)} off</strong> your
            next order when a friend buys through your link.
          </span>
        </div>
      )}
      {reward && (
        <div className="notice">
          <strong>Your reward is ready to validate.</strong>
          <br />
          Use the same phone number that earned it at checkout.
        </div>
      )}
      <div className="option-group">
        <label>Choose your option</label>
        <div className="option-row">
          {campaign.variants.map((item) => (
            <button
              key={item.id}
              className={`option ${variant === item.id ? "selected" : ""}`}
              onClick={() => setVariant(item.id)}
              disabled={item.availableQuantity === 0}
            >
              {item.option1Value}
              {item.option2Value ? ` · ${item.option2Value}` : ""}
              {item.availableQuantity === 0 ? " · Sold out" : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="option-group">
        <label>Quantity</label>
        <select className="app-input" aria-label="Quantity">
          <option>1</option>
          {(selected?.availableQuantity ?? 0) > 1 && <option>2</option>}
        </select>
      </div>
      {soldOut ? (
        <Link className="button" href={`/p/${campaign.shortCode}/restock`}>
          Tell me when it returns
        </Link>
      ) : (
        <Link className="button" href={checkoutHref}>
          Buy now <ArrowRight size={18} />
        </Link>
      )}
      <div className="trust-panel">
        <span>
          <ShieldCheck size={18} /> Secure payment powered by Paystack. No
          account required.
        </span>
        <span>
          <Truck size={18} /> {campaign.seller.pickupNote}
        </span>
        {campaign.chatFallbackEnabled && (
          <a href={`https://wa.me/${campaign.seller.whatsappPhone}`}>
            <MessageCircle size={18} /> Chat with seller
          </a>
        )}
      </div>
      <div className="sticky-buy">
        {soldOut ? (
          <Link className="button" href={`/p/${campaign.shortCode}/restock`}>
            Request restock
          </Link>
        ) : (
          <Link className="button" href={checkoutHref}>
            Buy now · {formatNaira(campaign.publicPriceKobo)}
          </Link>
        )}
      </div>
    </div>
  );
}
