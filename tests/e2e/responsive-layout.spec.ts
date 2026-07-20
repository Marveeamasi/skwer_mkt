import { expect, test, type Page } from "@playwright/test";

test.setTimeout(300_000);

async function expectNoHorizontalPageOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(sizes.page, JSON.stringify(sizes)).toBeLessThanOrEqual(
    sizes.viewport + 1,
  );
  expect(sizes.body, JSON.stringify(sizes)).toBeLessThanOrEqual(
    sizes.viewport + 1,
  );
}

test("auth cards, branding and footer never overlap", async ({ page }) => {
  for (const route of ["/login", "/register", "/forgot-password"]) {
    await page.goto(route);
    await expect(page.locator(".auth-card")).toBeVisible();
    await expectNoHorizontalPageOverflow(page);
    const boxes = await page.evaluate(() => {
      const header = document
        .querySelector(".auth-header")!
        .getBoundingClientRect();
      const card = document.querySelector(".auth-card")!.getBoundingClientRect();
      const footer = document
        .querySelector(".auth-foot")!
        .getBoundingClientRect();
      return {
        headerBottom: header.bottom,
        cardTop: card.top,
        cardBottom: card.bottom,
        footerTop: footer.top,
      };
    });
    expect(boxes.cardTop).toBeGreaterThanOrEqual(boxes.headerBottom);
    expect(boxes.footerTop).toBeGreaterThanOrEqual(boxes.cardBottom);
  }
});

test("public buyer routes fit the viewport", async ({ page }) => {
  for (const route of [
    "/",
    "/how-it-works",
    "/p/GLAM-PH-01",
    "/pricing",
    "/privacy",
    "/refunds",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expectNoHorizontalPageOverflow(page);
  }
});

test("authenticated seller shell remains usable without page overflow", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("amara@example.test");
  await page.getByLabel("Password", { exact: true }).fill("LocalOnly-123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/seller\//);
  for (const route of [
    "/seller/dashboard",
    "/seller/campaigns",
    "/seller/orders",
    "/seller/customers",
    "/seller/reports",
    "/seller/settings",
  ]) {
    await page.goto(route);
    await expect(page.locator(".app-main")).toBeVisible();
    await expectNoHorizontalPageOverflow(page);
  }
});
