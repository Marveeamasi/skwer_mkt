import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/configured";
export interface PublicCampaign {
  shortCode: string;
  status: string;
  stockMode: string;
  paymentMode: string;
  publicPriceKobo: number;
  referralRewardKobo: number;
  allowRestockInterest: boolean;
  chatFallbackEnabled: boolean;
  noindex: boolean;
  product: { name: string; description: string; category: string };
  media: { path: string; provider: "supabase" | "cloudinary"; type: "image" | "video"; alt: string; url?: string }[];
  seller: {
    businessName: string;
    city: string;
    state: string;
    whatsappPhone: string;
    shortDescription: string;
    pickupNote: string;
    deliveryNote: string;
    returnPolicy: string;
    fulfilmentMethods: string[];
    paymentVerified: boolean;
  };
  variants: {
    id: string;
    option1Name: string;
    option1Value: string;
    option2Name?: string;
    option2Value?: string;
    availableQuantity: number | null;
  }[];
}
export const demoCampaign: PublicCampaign = {
  shortCode: "GLAM-PH-01",
  status: "active",
  stockMode: "fixed",
  paymentMode: "full",
  publicPriceKobo: 1080000,
  referralRewardKobo: 50000,
  allowRestockInterest: true,
  chatFallbackEnabled: true,
  noindex: true,
  product: {
    name: "Soft Glam Set",
    description:
      "Everything you need for an easy everyday glow. Original products, carefully packed by Amara Beauty.",
    category: "Beauty",
  },
  media: [],
  seller: {
    businessName: "Amara Beauty",
    city: "Port Harcourt",
    state: "Rivers",
    whatsappPhone: "2348030000000",
    shortDescription:
      "Original beauty essentials with friendly pickup support in GRA.",
    pickupNote: "Pickup in GRA after order confirmation.",
    deliveryNote: "Delivery is arranged with the seller after payment.",
    returnPolicy:
      "Unopened products can be reported within 24 hours of pickup.",
    fulfilmentMethods: ["pickup", "seller_delivery"],
    paymentVerified: true,
  },
  variants: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      option1Name: "Shade",
      option1Value: "Warm",
      option2Name: "Size",
      option2Value: "Medium",
      availableQuantity: 4,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      option1Name: "Shade",
      option1Value: "Neutral",
      option2Name: "Size",
      option2Value: "Medium",
      availableQuantity: 2,
    },
  ],
};
export const getPublicCampaign = cache(
  async (shortCode: string): Promise<PublicCampaign | null> => {
    if (!isSupabaseConfigured())
      return shortCode === demoCampaign.shortCode ? demoCampaign : null;
    const { data, error } = await createAdminClient().rpc(
      "get_public_campaign",
      { p_short_code: shortCode },
    );
    if (error || !data) return null;
    const campaign = data as PublicCampaign;
    campaign.media = (campaign.media ?? []).map((asset) => {
      const encodedPath = asset.path.split("/").map(encodeURIComponent).join("/");
      const url = asset.provider === "cloudinary"
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${encodedPath}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-media/${encodedPath}`;
      return { ...asset, url };
    });
    return campaign;
  },
);
