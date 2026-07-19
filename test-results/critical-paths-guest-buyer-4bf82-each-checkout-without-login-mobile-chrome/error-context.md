# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: critical-paths.spec.ts >> guest buyer can select and reach checkout without login
- Location: tests\e2e\critical-paths.spec.ts:3:5

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
  - paragraph: "Seller policy: Unopened products can be reported within 24 hours of pickup."
  - text: Beauty · active
  - heading "Soft Glam Set" [level=1]
  - text: ₦10,800
  - paragraph: Everything you need for an easy everyday glow. Original products, carefully packed by Amara Beauty.
  - text: Buy this and earn
  - strong: ₦500 off
  - text: your next order when a friend buys through your link. Choose your option
  - button "Warm · Medium"
  - button "Neutral · Medium"
  - text: Quantity
  - combobox "Quantity":
    - option "1" [selected]
    - option "2"
  - text: Secure payment powered by Paystack. No account required. Pickup in GRA after order confirmation.
  - link "Chat with seller":
    - /url: https://wa.me/2348030000000
  - link "Buy now · ₦10,800":
    - /url: /checkout/GLAM-PH-01?variant=22222222-2222-4222-8222-222222222222
- alert
```

# Test source

```ts
  1 | import {test,expect} from "@playwright/test";
  2 | test("seller landing explains the core loop",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:/WhatsApp customers can bring/i})).toBeVisible();await expect(page.getByRole("link",{name:/Create my first sales link/i})).toBeVisible();await expect(page.getByText(/No monthly fee/i)).toBeVisible()});
> 3 | test("guest buyer can select and reach checkout without login",async({page})=>{await page.goto("/p/GLAM-PH-01");await expect(page.getByRole("heading",{name:"Soft Glam Set"})).toBeVisible();await expect(page.getByText("₦10,800").first()).toBeVisible();await page.getByRole("button",{name:/Neutral/i}).click();await page.locator('a[href^="/checkout/"]:visible').click();await expect(page.getByRole("heading",{name:"Complete your order"})).toBeVisible();await expect(page.getByText(/No account required/i).first()).toBeVisible()});
    |                                                                                                                                                                                                                                                                                                                                                                                                                                                      ^ Error: expect(locator).toBeVisible() failed
  4 | test("order bearer link has no indexing and shows timeline",async({page})=>{await page.goto("/order/demo-order-token");await expect(page.getByText("Payment confirmed")).toBeVisible();await expect(page.getByText(/Outstanding balance/i)).toBeVisible()});
  5 | test("policy pages disclose draft review status",async({page})=>{await page.goto("/privacy");await expect(page.getByText(/Draft for professional review/i)).toBeVisible();await page.goto("/reward-terms");await expect(page.getByText(/not cash wallets/i)).toBeVisible()});
  6 | 
```