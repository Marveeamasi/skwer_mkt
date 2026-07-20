import type { MetadataRoute } from "next";
import { publicConfig } from "@/lib/config";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: publicConfig.NEXT_PUBLIC_APP_NAME,
    short_name: publicConfig.NEXT_PUBLIC_APP_SHORT_NAME,
    description: publicConfig.NEXT_PUBLIC_APP_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFCF5",
    theme_color: "#B9F34A",
    icons: [
      { src: "/brand/logo-mark.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
