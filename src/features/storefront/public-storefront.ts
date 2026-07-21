import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";

export interface StorefrontCampaign {
  id: string;
  shortCode: string;
  name: string;
  description: string;
  category: string;
  priceKobo: number;
  imageUrl?: string;
  imageAlt?: string;
  available: boolean;
}
export interface PublicStorefront {
  seller: {
    businessName: string;
    slug: string;
    city: string;
    state: string;
    description: string;
    whatsappPhone: string;
    paymentVerified: boolean;
  };
  campaigns: StorefrontCampaign[];
}
function mediaUrl(provider: string, path: string) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return provider === "cloudinary"
    ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${encoded}`
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-media/${encoded}`;
}
export const getPublicStorefront = cache(
  async (slug: string): Promise<PublicStorefront | null> => {
    if (!/^[a-z0-9-]{2,100}$/.test(slug)) return null;
    const db = createAdminClient();
    const { data: seller } = await db
      .from("seller_businesses")
      .select(
        "id,business_name,slug,city,state,short_description,whatsapp_phone,is_active,is_approved,payment:seller_payment_accounts(provider_verified)",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("is_approved", true)
      .maybeSingle();
    if (!seller) return null;
    const { data: campaigns } = await db
      .from("campaigns")
      .select(
        "id,short_code,status,public_price_kobo,product:products(name,description,category,media:product_media(storage_path,provider,media_type,alt_text,sort_order),variants:product_variants(available_quantity,reserved_quantity,is_active))",
      )
      .eq("seller_id", seller.id)
      .in("status", ["active", "sold_out"])
      .order("created_at", { ascending: false });
    const payment = Array.isArray(seller.payment)
      ? seller.payment[0]
      : seller.payment;
    return {
      seller: {
        businessName: seller.business_name,
        slug: seller.slug,
        city: seller.city,
        state: seller.state,
        description: seller.short_description,
        whatsappPhone: seller.whatsapp_phone,
        paymentVerified: payment?.provider_verified ?? false,
      },
      campaigns: (campaigns ?? []).map((c) => {
        const product = Array.isArray(c.product) ? c.product[0] : c.product,
          media = (product?.media ?? [])
            .filter((m) => m.media_type === "image")
            .sort((a, b) => a.sort_order - b.sort_order)[0],
          variants = (product?.variants ?? []).filter((v) => v.is_active),
          available =
            c.status === "active" &&
            variants.some(
              (v) =>
                v.available_quantity == null ||
                Number(v.available_quantity) > Number(v.reserved_quantity),
            );
        return {
          id: c.id,
          shortCode: c.short_code,
          name: product?.name ?? "Product",
          description: product?.description ?? "",
          category: product?.category ?? "",
          priceKobo: Number(c.public_price_kobo),
          imageUrl: media
            ? mediaUrl(media.provider, media.storage_path)
            : undefined,
          imageAlt: media?.alt_text,
          available,
        };
      }),
    };
  },
);
