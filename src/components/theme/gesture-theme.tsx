"use client";
import { useEffect, useRef, useState } from "react";
type Theme = "light" | "dark";
type Start = {
  x: number;
  y: number;
  at: number;
  id: number;
  pointerType: string;
} | null;
const ignored =
  "a,button,input,textarea,select,summary,[role=button],[data-no-theme-gesture],[data-horizontal-scroll],.table-wrap,.option-row,.upload-box";
function systemTheme(): Theme {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem("skwer-theme");
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}
export function isThemeGesture(input: {
  dx: number;
  dy: number;
  elapsed: number;
  pointerType: string;
}) {
  const minimum = input.pointerType === "touch" ? 78 : 120;
  return (
    Math.abs(input.dx) >= minimum &&
    Math.abs(input.dx) >= Math.abs(input.dy) * 2 &&
    input.elapsed >= 70 &&
    input.elapsed <= 1800
  );
}
export function GestureTheme() {
  const start = useRef<Start>(null),
    noticeTimer = useRef<number | undefined>(undefined),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    applyTheme(storedTheme() ?? systemTheme());
    const system = () => {
      if (!storedTheme()) applyTheme(systemTheme());
    };
    const down = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        (event.pointerType === "mouse" && event.button !== 0)
      )
        return;
      const target = event.target as Element | null;
      if (!target || target.closest(ignored)) return;
      start.current = {
        x: event.clientX,
        y: event.clientY,
        at: performance.now(),
        id: event.pointerId,
        pointerType: event.pointerType,
      };
    };
    const cancel = () => {
      start.current = null;
    };
    const up = (event: PointerEvent) => {
      const gesture = start.current;
      start.current = null;
      if (!gesture || gesture.id !== event.pointerId) return;
      const candidate = {
        dx: event.clientX - gesture.x,
        dy: event.clientY - gesture.y,
        elapsed: performance.now() - gesture.at,
        pointerType: gesture.pointerType,
      };
      if (!isThemeGesture(candidate)) return;
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("skwer-theme", next);
      } catch {}
      applyTheme(next);
      setNotice(next === "dark" ? "Dark theme" : "Light theme");
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setNotice(""), 1200);
    };
    media.addEventListener("change", system);
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", cancel, { passive: true });
    return () => {
      media.removeEventListener("change", system);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", cancel);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);
  return (
    <div
      className={`theme-notice ${notice ? "show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {notice}
    </div>
  );
}
