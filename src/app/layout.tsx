import type { Metadata } from "next";
import "./globals.css";
import "./app.css";
import "./flows.css";
import "./theme.css";
import "./gesture.css";
import "./auth-controls.css";
import { publicConfig } from "@/lib/config";
import {GestureTheme} from "@/components/theme/gesture-theme";

export const metadata: Metadata = {
  metadataBase: new URL(publicConfig.NEXT_PUBLIC_APP_URL),
  title: { default: publicConfig.NEXT_PUBLIC_APP_NAME, template: `%s · ${publicConfig.NEXT_PUBLIC_APP_NAME}` },
  description: "Smart WhatsApp sales links with secure payment, order tracking and real buyer rewards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('skwer-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}`}}/></head><body>{children}<GestureTheme/></body></html>;
}
