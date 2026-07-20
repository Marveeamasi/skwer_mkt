import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { mediaProvider } from "@/lib/media/provider";
export async function POST(request: Request) {
  try {
    const supabase = await createClient(),
      { data } = await supabase.auth.getClaims(),
      userId = data?.claims?.sub;
    if (!userId)
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const form = await request.formData(),
      file = form.get("file"),
      campaignId = String(form.get("campaignId") ?? ""),
      altText = String(form.get("altText") ?? "Product image").trim().slice(0, 180),
      consentConfirmed = form.get("consentConfirmed") === "true";
    if (!(file instanceof File)) throw new Error("Choose a file");
    if (!campaignId) throw new Error("Campaign is required");
    if (!consentConfirmed) throw new Error("Confirm that you have permission to publish this media");
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("product_id")
      .eq("id", campaignId)
      .single();
    if (!campaign) throw new Error("Campaign not found");
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin",
      path = `${userId}/${Date.now()}-${nanoid(10)}.${extension}`,
      provider = mediaProvider(),
      asset = await provider.upload(path, file);
    const { error } = await supabase.from("product_media").insert({
      product_id: campaign.product_id,
      storage_path: asset.path,
      provider: asset.provider,
      media_type: file.type.startsWith("video/") ? "video" : "image",
      sort_order: 0,
      alt_text: altText || "Product image",
      consent_confirmed: consentConfirmed,
    });
    if (error) {
      await provider.remove([asset.path]).catch(() => undefined);
      throw error;
    }
    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
