# SKWER MKT — Implementation Progress Book

Last updated: 2026-07-19 (Africa/Lagos)

Status meanings:

- **COMPLETE** — implemented, connected to its intended data/service layer, and verified proportionately.
- **PARTIAL** — implementation exists but important behavior, persistence, security, or verification is still missing.
- **NOT STARTED** — no meaningful implementation exists yet.
- **EXTERNAL GATE** — cannot honestly be completed without provider approval, real credentials/configuration, legal review, or real-device/pilot access.

## Executive status

The application is a working, buildable Next.js product with a verified hosted Supabase schema, public buyer path, authenticated campaign/order queries and core payment/referral/reward services. It is **not yet production-complete**. Admin screens and some seller reports/settings still use fictional display data. Paystack test payments are enabled locally; split/live production payments remain disabled.

### Verified totals

- Hosted database: 4 sellers, 8 campaigns, 4 orders, 1 available reward, 1 restock request, 1 substitution offer, 1 active fee configuration.
- Unit tests: 38 passing across pricing, security, tokens, order transitions, money/deposit boundaries, phone validation, signed-value tampering, referrals, rewards, attribution, and mobile theme-gesture classification.
- Production build: passing after the latest hosted-environment changes; 32 routes/pages were generated, including the SVG icon and web manifest.
- TypeScript strict check: passing.
- ESLint: passing.
- Browser E2E assertions: all 8 mobile/desktop scenarios have passed, but the Windows Playwright web-server wrapper has not exited cleanly after completion; harness cleanup remains PARTIAL.

## Security and credentials

### COMPLETE

- Real configured values were copied into ignored `.env.local`.
- `.env.example` was sanitized back to safe placeholders.
- `.gitignore` excludes real `.env*` files and explicitly allows the sanitized `.env.example` to be committed.
- Service-role, Paystack, email, Cloudinary, and signing values are server-only in application code.
- Anonymous hosted RLS verification returns zero visible rows for `orders`, `payments`, `customers`, `reward_credits`, and `audit_logs`.
- Public product access is provided only through the scoped `get_public_campaign` RPC.
- Opaque order/reward bearer tokens use random generation and SHA-256 hashes.
- Paystack webhook signature verification uses HMAC SHA-512 and constant-time comparison.
- Referral cookie values are signed, HttpOnly, SameSite=Lax, path-scoped, and secure in production.
- `PAYSTACK_WEBHOOK_SECRET` is populated locally from `PAYSTACK_SECRET_KEY`, matching Paystack's actual signature model; `.env.example` retains only safe test placeholders.

### PARTIAL

- Independent 48-byte cryptographically random `ORDER_TOKEN_SECRET`, `REFERRAL_TOKEN_SECRET`, and `CRON_SECRET` values were generated into ignored `.env.local`; only uniqueness/length was logged.
- Migration 5 is applied and its hosted database-backed rate-limit RPC was verified. Signup OTP and restock submission now enforce it; checkout, referral, reward, login and token lookup wiring remains.
- Referral-link resolution and reward validation now enforce the hosted database rate limiter, reject malformed/bounded inputs, and avoid caching private validation responses. Checkout, login and bearer-page lookup wiring remains.
- Audit tables and admin UI exist, but all sensitive mutations are not yet routed through a shared audit service.
- File validation exists server-side; browser compression and metadata stripping are not implemented.

## Phase 0 — validation, configuration, policies

### COMPLETE

- Rebrandable public name, short name, tagline, URL, support details, and feature gates.
- Safe `.env.example` and populated ignored `.env.local`.
- Product positioning, landing page, inclusive-pricing explanation, and a responsive visual how-it-works walkthrough showing seller link creation, buyer selection, verified order tracking and referral qualification.
- Privacy, platform terms, seller terms, buyer terms, refund/cancellation, prohibited products, referral reward, dispute, and content/photo-consent pages.
- Every policy page is clearly marked as a draft requiring professional review.
- Square-background thumbs-up SVG logo system is implemented for navigation, favicon, web manifest and reusable brand assets; all default Vercel/Next placeholder assets were removed.
- Theme defaults to the browser colour preference, remembers a deliberate user override, and toggles only after a thresholded horizontal pointer release. Mobile pointer cancellation was corrected with `touch-action: pan-y pinch-zoom`, a calibrated touch threshold, protected native horizontal-scroll zones and safe storage handling. It does not cancel vertical scrolling, excludes interactive controls, announces the result accessibly, and respects reduced motion. Device retest awaits deployment of the latest commit.

### EXTERNAL GATE

- Domain ownership and final callback/webhook URLs.
- Nigerian legal, privacy, consumer, accounting, refund, and seller-terms review.
- Paystack written approval of multi-seller split/subaccount model and seller KYC requirements.
- Final prohibited-category review against current Paystack rules.

## Phase 1 — framework, auth, database, RLS, onboarding

### COMPLETE

- Next.js 16.2.10 App Router, React 19, strict TypeScript, Tailwind 4, local Plus Jakarta Sans, lockfile, Vitest and Playwright setup.
- All five hosted Supabase migrations plus `seed.sql` were applied by the user. Migration 5's rate-limit table/RPC was verified against the hosted project.
- Migration 5 atomic campaign creation was verified with an authenticated seed seller, seller-scoped readback, and immediate service-role cleanup.
- Schema includes every specified V1 entity plus analytics, invites, and custom email OTP records.
- RLS enabled across all application tables; hosted anonymous isolation verified.
- Atomic `reserve_variant`, expired-reservation release, and idempotent payment-success functions.
- Hosted seed data applied and verified.
- SSR cookie auth client, browser client, service-role client, PKCE callback, seller route protection, and admin role protection.
- Custom hosted-email OTP request and verified account-creation endpoints; Supabase email delivery is not used for signup verification.

### PARTIAL

- Registration failure was reproduced end to end. The endpoint path/body/secret are correct, but both an OTP message and a minimal control message to the configured support Gmail address were rejected by the standalone server's SMTP provider with `550 Message discarded as high-probability spam`. The application now normalizes the endpoint, returns truthful statuses, removes failed OTPs, atomically claims codes, rate-limits registration and rolls back partial users. Successful registration is externally blocked until the email-server project fixes its SMTP sender/domain configuration; real-inbox retest remains required.
- Login and registration now have accessible show/hide password controls. Signup keeps the password only in React memory instead of plaintext `sessionStorage`. Resend has an independent truthful loading state, recently issued unexpired codes remain valid despite mail delays, and UI wording distinguishes SMTP acceptance from inbox delivery.
- Public DNS verification found SPF and strict quarantine DMARC for `enthernetservices.com`; direct SMTP mail is spam-foldered/delayed. Server-only EmailJS is now the configured primary provider, with the Vercel Nodemailer service as automatic fallback; EmailJS credentials never enter the browser bundle. Real OTP requests through the local registration route returned 200 for both the support inbox and `amasimarvellous@gmail.com`. Actual inbox receipt and successful account creation still require confirmation.
- OTP-step DOM reuse was fixed with keyed steps and a controlled numeric code field, preventing the email address from appearing in the verification-code input. Resend has independent loading copy and all recently issued unexpired codes remain usable when delivery is delayed.
- Seller onboarding business-details UI now persists through an authenticated server endpoint with normalized phone data and an audit record. Payment onboarding and invite-token enforcement remain.
- Login works through Supabase password auth; forgot-password screen does not yet send/complete recovery through the custom email service.
- Optional fingerprint/passkey quick login is not implemented.
- Admin/support roles are enforced in route protection, but role-management operations are not implemented.

## Phase 2 — campaigns, pricing, media, sharing

### COMPLETE

- Integer-kobo money helpers and deterministic server-authoritative gross-up pricing engine.
- Paystack threshold, percentage, cap, platform fee, safety buffer, and rounding support.
- Four-screen mobile campaign-builder UI with maximum-two-dimension wording and pricing preview.
- Public product route `/p/[shortCode]` connected to hosted public campaign RPC.
- Seller identity, product, inclusive price, genuine availability, variants, reward explanation, fulfilment/policy, secure checkout trust, sticky mobile buy action, and WhatsApp seller link.
- Dynamic per-campaign title, description, canonical, robots, Open Graph, Twitter card, and generated OG image.
- Supabase/Cloudinary environment-switchable media provider and authenticated upload endpoint.

### PARTIAL

- Campaign-builder state and authenticated submit endpoint calculate with the active hosted fee configuration and call the applied atomic product/campaign/variant RPC. Authenticated hosted creation, seller-scoped readback, and cleanup were verified. Media uploads are still not linked back to `product_media` after creation.
- Product page currently uses generated visual placeholders rather than uploaded product media carousel/testimonials.
- Share caption, copy-link, Web Share, WhatsApp share, downloadable square card, vertical Status card, and canvas/route-generated asset download are not implemented.
- Campaign closing does not yet invoke provider-agnostic media cleanup.
- Cloudinary upload adapter is implemented but not integration-tested with the configured account.
- Seller campaign list and individual campaign management pages use seller-isolated hosted queries; editing campaign fields and media remains incomplete.

## Phase 3 — guest checkout, stock, Paystack, orders, deposits

### COMPLETE

- Guest checkout UI collects required buyer, option, fulfilment, address, and note data without account creation.
- Checkout initialization endpoint reloads campaign/variant, calculates monetary fields from database values instead of browser prices, and now calculates fixed/percentage deposit due-now amounts server-side.
- Customer/order/item/payment rows, reservation RPC, Paystack-hosted initialize client, amount-in-kobo handling, callback verification, raw webhook verification, event uniqueness, amount/currency matching, and atomic payment conversion are implemented.
- Live payment and split-payment launch gates default off.
- Demo callback explicitly states no money moved.
- Opaque-token order tracking page includes seller, payment/balance, fulfilment, events, message, seller contact, and noindex metadata.
- Deposit calculation domain helper and tests exist.

### PARTIAL

- Checkout does not yet snapshot/apply delivery fees from a seller-controlled fulfilment configuration.
- Deposit initialization is server-correct, but the checkout review UI cannot display the due-now deposit until the public campaign RPC exposes `deposit_value` (planned in the next hosted migration update).
- Seller balance-link generation, seven-day hashed links, buyer balance page, current-outstanding recalculation and Paystack initialization are implemented on applied migration 7, including duplicate-open-payment protection and verified-payment link completion.
- Browser callback now preserves the opaque order bearer token in tab-scoped session storage across the Paystack redirect and uses it for the verified order link; this still needs a real Paystack test-mode E2E verification.
- Webhook returns quickly and records errors, but no retryable internal job mechanism exists.
- Checkout abandonment/expired reservation scheduling is not wired to a cron job.
- Seller campaign list, order list and order detail query seller-isolated hosted data. Campaign/order status changes and balance-link creation persist through authenticated/audited endpoints and immutable order events. Refund request and admin submission UI/API are implemented but require migration 8 before use; private notes and buyer-message editing remain.
- Seller order CSV export is implemented with private/no-store response headers and escaped cells.
- Paystack configured key has not been used for a real test-mode transaction in this verification session.
- ngrok configuration, ignored credential, launch script and webhook guide are implemented. After explicit user approval, an HTTPS tunnel was opened and verified on 2026-07-19; `.env.local` uses its temporary public base URL for test callbacks. The URL is ephemeral and must be replaced for production.

## Phase 4 — referrals and rewards

### COMPLETE

- Referral redirect route, signed attribution cookie, default 14-day model, and attribution-lock domain rules.
- Reward validation domain rules: same seller, same normalized phone, available, unexpired, single-use/no stacking behavior.
- Distinct buyer/self-referral test logic.
- Reward validation API and private noindex reward display route.
- Seed includes direct order, referred paid order, qualified attribution, and available reward.

### PARTIAL

- Successful full payment processing now creates the buyer's referral link idempotently from either callback verification or webhook processing.
- Checkout now reads and verifies the signed referral cookie, validates campaign/expiry/distinct phone+email, locks attribution to the created order, and snapshots referred reward funding. This needs hosted integration coverage with real checkout initialization.
- Fraud signal collection/admin review is represented in schema/UI but not fully computed.
- Delivered/picked-up status now qualifies paid referral attribution, creates a 60-day token-scoped available reward idempotently, and attempts the configured transactional email notification.
- Reward code generation, checkout application, atomic redemption, expiry job, refund reversal, and redeemed-reward review workflow are not implemented end to end.
- Migration 6 is applied and hosted-verified: its balance/refund/review ledgers are accessible and `redeem_reward_atomic` was verified present through a non-mutating missing-order probe. Reward tokens now persist from reward page to product and checkout, checkout calls atomic redemption using the normalized owner phone, blocks referral stacking, recalculates total/deposit after accepted credit, and reports safe errors. A full hosted redemption transaction still needs an isolated fixture test.
- Migration 7 is applied and hosted-verified. An isolated temporary-record test redeemed ₦500 credit, rejected a duplicate redemption, compensated the failed checkout, restored the credit, accepted one open balance payment and rejected the duplicate; all temporary records were cleaned up. Stock-reservation compensation and verified Paystack completion still need provider-path coverage.
- Reward page now resolves only the hashed bearer token and displays hosted seller, amount, status, expiry and campaign redemption destination.
- Referral/Status share actions are present only as nonfunctional buttons in some screens.

## Phase 5 — seller operations

### COMPLETE

- Responsive seller shell and intended information hierarchy.
- Dashboard, campaign list, orders, order detail, customers, reports, settings, and onboarding screens.
- UI covers attention reminders, referral metrics, restock demand, payment/balance visibility, customer preferences from actual-purchase concept, and profit-estimate disclaimer.
- Restock and substitution tables plus verified seed records.

### PARTIAL

- Campaign, order, dashboard, customer and report screens now use authenticated seller-isolated hosted queries. Fictional seller metrics were removed; report profit is explicitly conservative and based only on entered purchase costs.
- Order status updates persist with transition validation, audit entries and immutable public events. Secure balance links are connected. Migration 8 is applied and its atomic completion function is hosted-verified. Seller refund request, admin approval, Paystack submission, partial/full completion, failure recovery and reward reversal are connected; a real Paystack refund remains an external provider-path test. Filters/search behavior, private notes and buyer-message editing remain.
- Deterministic follow-up reminders and copyable WhatsApp templates are displayed conceptually but not generated from real orders.
- Restock request form is wired to its rate-limited hosted API and provides a no-charge success state; hosted browser submission still needs integration verification.
- Restock grouping, contact/convert actions, and notification copy are not connected.
- Substitution create/accept/reject/expire flow is not connected to seller and buyer pages.
- Customer aggregates and reports are not yet queried/calculated from hosted records.
- Order CSV export is implemented; report/customer exports remain.

## Phase 6 — admin and launch hardening

### COMPLETE

- Protected admin shell and pages for overview, sellers, campaigns, transactions, rewards, disputes, pricing, and settings.
- Admin displays required metric categories, pricing version concept, payment mismatch/webhook review, reward fraud review, moderation and launch gates.

### PARTIAL

- Admin screens use fictional display data and actions do not persist.
- Seller invite/approve/reject/suspend, campaign pause, fee configuration version creation, transaction reconciliation/retry, refund recording, reward reversal/goodwill credit, and feature flag mutation need server-authorized audited endpoints.
- First-party analytics table exists but event capture and metric queries are not wired.
- Content reporting/moderation intake is not implemented.

## Testing and quality

### COMPLETE

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm test` passes: 5 files, 38 unit tests, including adversarial money/deposit boundaries, illegal state transitions, reward/referral abuse, malformed phones, signed-value tampering and mobile/desktop gesture classification.
- `npm run build` passes after the 2026-07-19 mobile gesture, reward and balance-payment changes, generating 33 optimized static/dynamic application routes.
- Hosted schema and seed counts verified through service-role read-only checks.
- Hosted anonymous RLS isolation and public RPC access verified.
- Mobile and desktop browser assertions cover landing, guest product-to-checkout, order tracking, and policy disclosure; every assertion has passed.
- No live-production claims are made.

### PARTIAL

- Playwright's assertions finish, but the managed Windows Next.js web-server child process does not exit cleanly, causing command timeout; harness lifecycle needs correction before marking E2E command green.
- SQL pgTAP file exists, but it was not run because local Docker/Supabase is unavailable. Hosted behavioral RLS checks were run instead.
- Integration tests for checkout database writes, duplicate webhooks, amount mismatch, seller isolation, referral qualification, reward reversal, and token scope are not automated yet.
- Full specified E2E payment/referral/reward loop is not automated yet.
- Lighthouse performance/accessibility targets have not been measured.
- Screen-reader, keyboard-only, reduced-motion, low-end Android, iPhone Safari, WhatsApp in-app browser, and Instagram in-app browser manual checks remain.
- Client bundle secret scan is not automated yet.

## Explicitly not included in V1

Cash wallets/withdrawals, loans, escrow claims, BNPL, credit scoring, unverified ratings, open chat, delivery-driver app, supplier network, AI features, live-streaming, public social feed/marketplace, monthly billing, native apps, cryptocurrency, and gambling-style referral mechanics remain intentionally excluded.

## Immediate next execution order

1. Run real Paystack test-mode checkout/webhook/balance completion and stock-reservation compensation coverage.
2. Finish database-backed rate-limit wiring for checkout, login and bearer-token lookup.
3. Finish payment onboarding and media record linking; seller onboarding and authenticated campaign creation are already hosted-verified.
4. Apply and verify migration 8; then finish substitutions, restock operations, filters, notes/messages and remaining exports.
5. Connect audited admin mutations and analytics.
6. Complete hosted integration tests, reliable Playwright lifecycle, performance/accessibility checks, and deployment documentation.

## External launch gates

- Paystack written approval and seller settlement/KYC confirmation.
- Test-mode transaction and webhook verification with the configured Paystack account.
- Legal/privacy/refund/reward/seller terms approval.
- Production domain, callback and webhook configuration.
- Real hosted email delivery verification.
- Pilot tests with the four intended vendors and real low-cost mobile devices.
