import { test, expect } from "@playwright/test";
test("seller landing explains the core loop", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /WhatsApp customers can bring/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Create my first sales link/i }),
  ).toBeVisible();
  await expect(page.getByText(/No monthly fee/i)).toBeVisible();
});
test("guest buyer can select and reach checkout without login", async ({
  page,
}) => {
  await page.goto("/p/GLAM-PH-01");
  await expect(
    page.getByRole("heading", { name: "Soft Glam Set" }),
  ).toBeVisible();
  await expect(page.getByText(/^₦[\d,]+$/).first()).toBeVisible();
  await page.getByRole("button", { name: /Warm|Neutral/i }).first().click();
  await page.locator('a[href^="/checkout/"]:visible').click();
  await expect(
    page.getByRole("heading", { name: "Complete your order" }),
  ).toBeVisible();
  await expect(page.getByText(/No account required/i).first()).toBeVisible();
});
test("unknown order bearer tokens disclose no order data", async ({ page }) => {
  const response = await page.goto("/order/not-a-real-order-token");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});
test("policy pages disclose draft review status", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByText(/Draft for professional review/i)).toBeVisible();
  await page.goto("/reward-terms");
  await expect(page.getByText(/not cash wallets/i)).toBeVisible();
});
