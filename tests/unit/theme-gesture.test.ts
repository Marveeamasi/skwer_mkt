import { describe, expect, it } from "vitest";
import { isThemeGesture } from "@/components/theme/gesture-theme";
describe("theme swipe classification", () => {
  it("accepts deliberate horizontal touch releases in either direction", () => {
    expect(
      isThemeGesture({ dx: 90, dy: 12, elapsed: 240, pointerType: "touch" }),
    ).toBe(true);
    expect(
      isThemeGesture({ dx: -100, dy: -15, elapsed: 300, pointerType: "touch" }),
    ).toBe(true);
  });
  it("does not toggle for vertical scroll, diagonal movement, taps, or long holds", () => {
    expect(
      isThemeGesture({ dx: 20, dy: 160, elapsed: 300, pointerType: "touch" }),
    ).toBe(false);
    expect(
      isThemeGesture({ dx: 90, dy: 60, elapsed: 300, pointerType: "touch" }),
    ).toBe(false);
    expect(
      isThemeGesture({ dx: 20, dy: 2, elapsed: 120, pointerType: "touch" }),
    ).toBe(false);
    expect(
      isThemeGesture({ dx: 100, dy: 2, elapsed: 1900, pointerType: "touch" }),
    ).toBe(false);
  });
  it("keeps the mouse threshold higher to avoid accidental desktop toggles", () => {
    expect(
      isThemeGesture({ dx: 90, dy: 2, elapsed: 200, pointerType: "mouse" }),
    ).toBe(false);
    expect(
      isThemeGesture({ dx: 130, dy: 2, elapsed: 200, pointerType: "mouse" }),
    ).toBe(true);
  });
});
