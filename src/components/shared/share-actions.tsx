"use client";
import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareAction({ url, title, text, label = "Share", className = "button button-small button-secondary" }: { url: string; title: string; text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const absolute = new URL(url, window.location.origin).toString();
    try {
      if (navigator.share) await navigator.share({ title, text, url: absolute });
      else await navigator.clipboard.writeText(absolute);
      setDone(true);
      window.setTimeout(() => setDone(false), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setDone(false);
    }
  }
  return <button type="button" className={className} onClick={share}>{done ? <Check size={17} /> : label.toLowerCase().includes("copy") ? <Copy size={17} /> : <Share2 size={17} />}{done ? "Copied" : label}</button>;
}
