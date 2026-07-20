# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: critical-paths.spec.ts >> guest buyer can select and reach checkout without login
- Location: tests\e2e\critical-paths.spec.ts:12:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Complete your order' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Complete your order' })

```

```yaml
- main:
  - navigation:
    - link "↗ SKWER":
      - /url: /
    - text: AM
    - strong: Amara Beauty
    - text: Port Harcourt · Verified payment account
  - text: Sold by Amara Beauty
  - paragraph: "Seller policy: Report unopened items within 24 hours."
  - text: Beauty · active
  - heading "Soft Glam Set" [level=1]
  - text: ₦11,000
  - paragraph: Fictional development campaign.
  - text: Buy this and earn
  - strong: ₦500 off
  - text: your next order when a friend buys through your link. Choose your option
  - button "Warm · Medium"
  - text: Quantity
  - combobox "Quantity":
    - option "1" [selected]
    - option "2"
  - text: Secure payment powered by Paystack. No account required. GRA pickup after confirmation.
  - link "Chat with seller":
    - /url: https://wa.me/2348030000001
  - link "Buy now · ₦11,000":
    - /url: /checkout/GLAM-PH-01?variant=b071d703-831b-47fa-a5c6-d27fb05672d1
- status
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | test("seller landing explains the core loop", async ({ page }) => {
  3  |   await page.goto("/");
  4  |   await expect(
  5  |     page.getByRole("heading", { name: /WhatsApp customers can bring/i }),
  6  |   ).toBeVisible();
  7  |   await expect(
  8  |     page.getByRole("link", { name: /Create my first sales link/i }),
  9  |   ).toBeVisible();
  10 |   await expect(page.getByText(/No monthly fee/i)).toBeVisible();
  11 | });
  12 | test("guest buyer can select and reach checkout without login", async ({
  13 |   page,
  14 | }) => {
  15 |   await page.goto("/p/GLAM-PH-01");
  16 |   await expect(
  17 |     page.getByRole("heading", { name: "Soft Glam Set" }),
  18 |   ).toBeVisible();
  19 |   await expect(page.getByText(/^₦[\d,]+$/).first()).toBeVisible();
  20 |   await page.getByRole("button", { name: /Warm|Neutral/i }).first().click();
  21 |   await page.locator('a[href^="/checkout/"]:visible').click();
  22 |   await expect(
  23 |     page.getByRole("heading", { name: "Complete your order" }),
> 24 |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  25 |   await expect(page.getByText(/No account required/i).first()).toBeVisible();
  26 | });
  27 | test("unknown order bearer tokens disclose no order data", async ({ page }) => {
  28 |   const response = await page.goto("/order/not-a-real-order-token");
  29 |   expect(response?.status()).toBe(404);
  30 |   await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  31 | });
  32 | test("policy pages disclose draft review status", async ({ page }) => {
  33 |   await page.goto("/privacy");
  34 |   await expect(page.getByText(/Draft for professional review/i)).toBeVisible();
  35 |   await page.goto("/reward-terms");
  36 |   await expect(page.getByText(/not cash wallets/i)).toBeVisible();
  37 | });
  38 | 
```