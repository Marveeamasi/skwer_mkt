import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
export interface MediaAsset {
  provider: "supabase" | "cloudinary";
  path: string;
  publicUrl: string;
}
export interface MediaProvider {
  upload(path: string, file: File): Promise<MediaAsset>;
  remove(paths: string[]): Promise<void>;
}
class SupabaseMedia implements MediaProvider {
  async upload(path: string, file: File) {
    if (
      !["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(
        file.type,
      ) ||
      file.size > 10 * 1024 * 1024
    )
      throw new Error("Unsupported media file");
    const db = createAdminClient(),
      { error } = await db.storage
        .from("campaign-media")
        .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return {
      provider: "supabase" as const,
      path,
      publicUrl: db.storage.from("campaign-media").getPublicUrl(path).data
        .publicUrl,
    };
  }
  async remove(paths: string[]) {
    if (!paths.length) return;
    const { error } = await createAdminClient()
      .storage.from("campaign-media")
      .remove(paths);
    if (error) throw error;
  }
}
class CloudinaryMedia implements MediaProvider {
  private config() {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME,
      key = process.env.CLOUDINARY_API_KEY,
      secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !key || !secret)
      throw new Error("Cloudinary is not configured");
    return { cloud, key, secret };
  }
  async upload(path: string, file: File) {
    const { cloud, key, secret } = this.config(),
      timestamp = Math.floor(Date.now() / 1000),
      publicId = path.replace(/\.[^.]+$/, "");
    const signature = createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${secret}`)
        .digest("hex"),
      form = new FormData();
    form.set("file", file);
    form.set("api_key", key);
    form.set("timestamp", String(timestamp));
    form.set("public_id", publicId);
    form.set("signature", signature);
    const resource = file.type.startsWith("video/") ? "video" : "image",
      response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/${resource}/upload`,
        { method: "POST", body: form, signal: AbortSignal.timeout(30000) },
      ),
      body = await response.json();
    if (!response.ok)
      throw new Error(body.error?.message ?? "Media upload failed");
    return {
      provider: "cloudinary" as const,
      path: body.public_id,
      publicUrl: body.secure_url,
    };
  }
  async remove(paths: string[]) {
    const { cloud, key, secret } = this.config();
    for (const publicId of paths) {
      const timestamp = Math.floor(Date.now() / 1000),
        signature = createHash("sha1")
          .update(`public_id=${publicId}&timestamp=${timestamp}${secret}`)
          .digest("hex"),
        body = new URLSearchParams({
          public_id: publicId,
          timestamp: String(timestamp),
          api_key: key,
          signature,
        });
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/destroy`,
        { method: "POST", body, signal: AbortSignal.timeout(15000) },
      );
      if (!response.ok) throw new Error("Media cleanup failed");
    }
  }
}
export function mediaProvider(): MediaProvider {
  return process.env.MEDIA_PROVIDER === "cloudinary"
    ? new CloudinaryMedia()
    : new SupabaseMedia();
}
