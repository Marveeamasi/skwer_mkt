# SKWER MKT

> **Working product name:** SKWER MKT  
> **Product type:** WhatsApp-assisted social-commerce checkout, referral, order and repeat-sales platform for Nigerian informal vendors  
> **Primary launch market:** Port Harcourt, Rivers State, Nigeria  
> **Initial categories:** Clothes, makeup/beauty products and household accessories  
> **Initial pilot sellers:** The four interviewed vendors  
> **Status:** Product specification for Version 1 implementation

---

## 0. Important Reality Check

SKWER MKT cannot honestly guarantee that every seller will immediately love it, every product will become viral, or every buyer will repeatedly refer friends. No product specification can guarantee those outcomes. But this is the expectations so the design, layouts, UI UX should speak all these.

What SKWER MKT can do is create the strongest practical conditions for adoption:

1. It does not ask sellers to abandon WhatsApp.
2. It helps sellers make more sales, not merely record old sales.
3. It makes payment automatically create an order, reserve stock and record the customer.
4. It gives buyers a concrete reason to share products.
5. It requires no buyer account before purchase.
6. It charges sellers no setup or subscription fee in Version 1.
7. It earns only when a successful order occurs.
8. It quietly solves order, stock, payment, follow-up, delivery and reporting stress behind the main customer-acquisition benefit.

The product must be **habit-forming because it is useful**, not addictive through manipulation. It must not use fake scarcity, hidden charges, forced referrals, misleading discounts, disguised subscriptions or dark patterns.

---

## 1. Brand Warning

The codebase must therefore never hardcode the brand name. Use configuration values such as:

```env
NEXT_PUBLIC_APP_NAME="SKWER MKT"
NEXT_PUBLIC_APP_SHORT_NAME="SKWER"
NEXT_PUBLIC_APP_TAGLINE="One buyer can bring the next."
NEXT_PUBLIC_SUPPORT_EMAIL="support@example.com"
NEXT_PUBLIC_SUPPORT_PHONE=""
```

If the name changes, the application should be rebrandable without database or business-logic changes.

---

## 2. Product Summary

SKWER MKT is the selling tool that begins where WhatsApp becomes weak. It should seem to sellers and buyers as a very useful extension of WhatsApp.

Vendors continue to:

- post products on WhatsApp Status;
- advertise inside WhatsApp groups;
- chat privately with customers;
- post customer photographs and testimonials;
- source products using their existing private methods;
- determine their own selling price and expected profit;
- arrange pickup, personal delivery, dispatch or waybill.

SKWER MKT handles what happens after a customer becomes interested:

- product selection;
- size, colour and quantity selection;
- buyer information;
- secure payment;
- automatic payment verification;
- stock reservation;
- deposit and balance tracking;
- order confirmation;
- order-status tracking;
- referral attribution;
- buyer reward generation;
- seller follow-up;
- simple sales and profit records;
- restock interest;
- repeat-customer history.

The core loop is:

```text
Seller creates one product campaign or a collection 
        ↓
Seller shares the product link on WhatsApp
        ↓
Buyer opens the link without registering
        ↓
Buyer chooses variation and pays
        ↓
Order is automatically created and stock is reserved
        ↓
Buyer receives a personal sharing link
        ↓
A new buyer purchases through that link
        ↓
Original buyer earns seller-specific purchase credit and it's added to their earnings bar
        ↓
Seller gains a new customer
        ↓
New buyer receives another sharing opportunity
```

---

## 3. Product Positioning

### 3.1 One-sentence seller promise

> Turn every successful WhatsApp order into an opportunity to get another customer.

### 3.2 One-sentence buyer promise

> Buy securely, track your order and earn a real money for another purchase when your recommendation creates a real purchase.

### 3.3 Seller pitch

> You already sell on WhatsApp. SKWER MKT gives each product a smart payment link that records the order, confirms payment, reserves the item and helps your buyers bring you more buyers.

### 3.4 What SKWER MKT is not

SKWER MKT is not:

- another generic online store builder;
- a public marketplace in Version 1;
- a replacement for WhatsApp;
- a social network;
- a supplier marketplace;
- a delivery company;
- a cash wallet;
- a bank or fintech product;
- a file-storage or proof-page product;
- a monthly SaaS subscription;
- an affiliate network with cash withdrawals;
- an inventory ERP;
- an advertising agency.

---

## 4. Research Foundation

The first version is based on four vendor interviews covering clothing, makeup and household products.

Repeated patterns from the responses:

- WhatsApp Status, WhatsApp groups and WhatsApp private chats are the dominant selling channels.
- Sellers already understand their WhatsApp routines and do not want a replacement.
- Sellers buy small quantities, restock periodically or collect payment before sourcing.
- Sellers use notebooks, WhatsApp chats and memory to record requests and orders.
- Real pains include posting products, writing orders, calculating sales and profit, repeated customer questions, delivery coordination, unavailable colours/sizes and customers promising to pay but failing to complete payment.
- Requested improvements included one link per product, buyer-selected variants, payment connected to the correct order, automatic confirmation, stock reservation, deposit records, sales summaries and simple profit records.
- “Business awareness,” “advertise,” “money” and getting more customers were stronger emotional desires than pure payment administration.
- Several sellers were concerned that customers might distrust unfamiliar payment links, prefer direct transfer, see extra charges, experience failed payments or find the system difficult.

Therefore, the main acquisition promise is **more customers and more completed sales**. Payment, order records and reports are supporting infrastructure.

---

## 5. Target Users

### 5.1 Primary seller persona

A Nigerian informal or small-scale seller who:

- sells through WhatsApp Status, groups or private chats;
- may also use Instagram, TikTok or Facebook;
- has approximately 3–50 completed sales weekly;
- has no formal e-commerce website or does not actively use it;
- receives bank transfers and screenshots;
- sells products with colours, sizes, quantities or limited stock;
- needs repeat customers and referrals;
- wants more sales but does not want another complicated business application;
- uses an Android phone as the main business device;
- may have limited mobile data and intermittent connectivity.

### 5.2 Initial seller categories

1. Clothing and fashion resellers.
2. Makeup and beauty-product vendors.
3. Household-item and accessory vendors.
4. Footwear, bags and jewellery vendors.
5. Children’s clothing and accessories.
6. Foodstuff and small bulk-order sellers, after initial validation.

### 5.3 Buyer persona

A Nigerian buyer who:

- discovers products through WhatsApp or another social platform;
- wants to buy quickly without creating an account;
- trusts the known seller more than an unknown marketplace;
- prefers bank transfer, Paystack transfer, card, USSD or another familiar Paystack channel;
- values a clear receipt and order-status link;
- may share a product when there is a meaningful personal reward;
- uses a low- or mid-range Android phone.

### 5.4 Admin persona

The platform owner or support person who needs to:

- approve pilot sellers;
- configure pricing;
- review transactions;
- reconcile Paystack events;
- handle disputes and refunds;
- reverse fraudulent rewards;
- monitor campaign and referral performance;
- moderate prohibited products;
- change global settings without deploying code.

---

## 6. Core Product Principles

### 6.1 WhatsApp remains the front door

Sellers do not have to build a full store before sharing. A seller can create one product and immediately receive a shareable link and WhatsApp-ready caption.

### 6.2 One product is the minimum useful unit

Version 1 is campaign-first, not catalogue-first. Every product campaign has its own short link.

Example:

```text
https://skwermkt.com/p/BLK-DRESS-9K2
```

Later versions may add a seller catalogue, but it must never be required before a seller can make the first sale.

### 6.3 No buyer registration before payment

A buyer must not be asked to create a password, verify an account or download an application.

The buyer supplies only what is necessary:

- name;
- WhatsApp/phone number;
- email address for Paystack payment and receipt;
- selected variation;
- fulfilment information.

### 6.4 One final price

The buyer must see one consistent final item price from the product page to checkout. Do not show a lower price and add a surprise platform charge later.

The buyer may see:

- item total;
- delivery amount where applicable;
- reward credit applied where applicable;
- final total.

The buyer does not need to see the seller’s cost, seller target, platform margin or reward-funding breakdown. They should never know tha5 sellers added the bonus or app fee added else there is no free mentally in the app

### 6.5 Seller controls economics

The seller enters the minimum amount they must receive for the item. The platform calculates a public price that can cover:

- seller minimum take-home;
- Paystack processing cost;
- SKWER MKT revenue;
- seller-selected referral reward;
- rounding and safety buffer.

The seller sees the complete breakdown before publishing.

### 6.6 Pay only when a sale occurs

No seller setup fee. No monthly subscription in Version 1. SKWER MKT earns from completed transactions.

### 6.7 Referrals must be real sales

A click, page view or WhatsApp share does not create a reward. A qualifying paid order creates a pending reward. The reward becomes available only after the configured eligibility event.

### 6.8 Rewards are not cash wallets

Version 1 rewards are:

- seller-specific;
- non-transferable;
- non-withdrawable;
- redeemable only against a later purchase from the same seller;
- represented by a one-time reward code or secure reward token;
- subject to expiry and fraud checks.

Do not build cash withdrawals, transferable balances or peer-to-peer transfer in Version 1.

### 6.9 No fake gamification

Use celebration, progress and positive feedback, but never:

- fake countdowns;
- fake stock numbers;
- fake buyers;
- false “someone just purchased” alerts;
- forced sharing;
- endless notifications;
- misleading reward claims.

---

## 7. Version 1 Product Scope

Version 1 must contain the smallest complete system that delivers the full value loop.

### 7.1 Seller account and onboarding

The seller can:

- register with email and password or also add finger print for mobile device for quick login with easy forgot password and on sign up email verification using normal OTP and not supabase email sending ,I will disable it;
- create one business profile;
- add business name;
- add WhatsApp phone number;
- choose product category;
- choose city/state;
- upload logo or profile image;
- write a short trust description;
- set pickup location text;
- define default delivery note;
- add return/refund policy;
- submit settlement bank details;
- accept seller terms;
- create a Paystack subaccount through the server, where approved;
- remain in test/draft mode until payment onboarding is approved.

Onboarding must show a three-step progress indicator:

1. Business details.
2. Payment details.
3. Create first product.

The seller should be able to publish the first test campaign in under five minutes.

### 7.2 Seller trust profile

Each public product page displays a small seller card:

- business name;
- profile image/logo;
- city;
- WhatsApp contact button;
- fulfilment methods;
- seller policy;
- number of completed SKWER MKT orders after a minimum threshold;
- “Verified payment account” only when genuinely verified.

Do not display unverifiable badges.

### 7.3 Product campaign builder

A campaign is a shareable sales offer for one product.

Required fields:

- product title;
- category;
- one primary image;
- seller target amount;
- stock type;
- fulfilment method;
- campaign status.

Optional fields:

- additional images;
- short video, subject to storage limits;
- description;
- colours;
- sizes;
- quantity by variation;
- purchase cost for private profit calculation;
- referral reward;
- campaign end date;
- reservation duration;
- deposit configuration;
- pickup location;
- delivery note;
- customer photographs/testimonials with consent;
- restock-request option;
- substitution permission.

Campaign statuses:

```text
draft
active
paused
sold_out
ended
archived
```

### 7.4 Product variations

Support:

- colour;
- size;
- style/type;
- quantity;
- optional custom variation label.

Each variation can have:

- SKU;
- available quantity;
- seller target amount override;
- public price override only when permitted;
- active/inactive state.

For Version 1, restrict products to a maximum of two variation dimensions per campaign to keep the mobile interface simple.

### 7.5 Stock modes

Support three seller-selectable stock modes:

#### Fixed stock

The seller enters available quantities. Successful payment reserves and deducts stock.

#### Available on request

The seller can accept orders without a fixed quantity. The public page clearly says the item will be confirmed or sourced after payment according to the seller policy.

#### Preorder

The seller accepts orders until a deadline and provides an expected fulfilment date.

### 7.6 Payment modes

Support:

#### Full payment

The buyer pays the complete amount before the order is confirmed.

#### Fixed deposit

The seller specifies a fixed deposit amount.

#### Percentage deposit

The seller specifies a percentage, subject to admin minimums.

Rules:

- A referral reward is not earned until the full order value is paid.
- The seller can generate a balance-payment link from the order.
- The same order reference must be used for all instalments.
- The order page clearly displays amount paid and outstanding balance.
- Stock reservation for deposits expires according to the seller’s configured policy.

### 7.7 Public product page

Route:

```text
/p/[shortCode]
```

The product page must load quickly and display:

1. Seller identity.
2. Product image carousel.
3. Product title.
4. One final public price.
5. Genuine stock/preorder status.
6. Seller-selected referral reward message.
7. Colour/size selectors.
8. Quantity selector.
9. Pickup/delivery information.
10. Seller policy.
11. Customer proof section, where provided with consent.
12. Secure checkout indicator.
13. Sticky “Buy now” button.
14. “Chat with seller” secondary action, where enabled.
15. Restock request when sold out.

Recommended reward copy:

> Buy this and earn ₦500 off your next order when a friend buys through your link.

Do not write “free money” or “cashback” when the reward is store credit.

### 7.8 Dynamic WhatsApp preview

Every campaign link must generate dynamic Open Graph metadata containing:

- primary product image;
- seller business name;
- product title;
- final price;
- reward message;
- SKWER MKT branding.

The preview is central to distribution. A generic application preview is unacceptable.

The app should also generate downloadable share assets without an external design API:

- square WhatsApp post card;
- vertical WhatsApp Status card;
- clean product card without supplier/private information;
- prewritten caption;
- copy-link button;
- Web Share API button;
- WhatsApp deep-link share button.

### 7.9 Buyer checkout

Checkout is a single mobile-first flow.

#### Step 1: Product selection

- variation;
- quantity;
- fulfilment method.

#### Step 2: Buyer information

- full name;
- WhatsApp phone number;
- email for secure payment receipt;
- delivery address only when required;
- optional note.

#### Step 3: Review

Display:

- product and variation;
- quantity;
- item total;
- delivery;
- reward credit applied;
- final amount;
- seller name;
- fulfilment estimate;
- refund policy link.

#### Step 4: Payment

Initialize Paystack on the server and redirect to Paystack Checkout.

Do not process card details inside SKWER MKT.

#### Step 5: Success

After server verification:

- show success confirmation;
- show order reference;
- show order-status link;
- show receipt summary;
- show “Save this order link”;
- show referral sharing card;
- offer one-tap WhatsApp sharing;
- use brief, optional celebration animation;
- respect reduced-motion settings.

### 7.10 Guest buyer identity

Buyers do not create accounts.

Each buyer order receives:

- an opaque public order token;
- an HttpOnly buyer-session cookie when possible;
- an order reference;
- a seller-specific normalized phone identity;
- a secure reward/referral token.

The order route must not expose internal numeric IDs:

```text
/order/[publicToken]
```

The buyer can save or send this link to themselves on WhatsApp.

### 7.11 Referral creation

After a successful qualifying purchase, create one referral link tied to:

- buyer identity;
- seller;
- campaign;
- originating order;
- reward rules;
- expiry;
- fraud signals.

Example:

```text
https://skwermkt.com/r/K4P9ZX
```

The referral route redirects to the product page and stores a signed attribution cookie.

Attribution window for Version 1:

- default: 14 days;
- configurable by admin;
- last valid SKWER MKT referral wins;
- direct seller links do not overwrite an existing valid referral unless the buyer explicitly removes it;
- never overwrite attribution after checkout initialization.

### 7.12 Referral reward rules

Default Version 1 rules:

1. Buyer A completes an eligible order.
2. Buyer A receives a personal referral link.
3. Buyer B opens that link and completes full payment.
4. Buyer B must be a distinct buyer under fraud rules.
5. Buyer A’s reward becomes `pending`.
6. The reward becomes `available` after Buyer B’s order is delivered/picked up, or after an admin-defined confirmation period.
7. Buyer A receives a seller-specific reward code visible on the original order/reward page.
8. Buyer A applies it to a later order from the same seller.
9. The code is single-use, non-cash and non-transferable.

Reward states:

```text
pending
available
redeemed
expired
reversed
cancelled
```

Default reward expiry: 60 days after becoming available.

### 7.13 Reward funding model

The seller chooses:

- minimum amount they must receive;
- referral reward amount;
- optional purchase cost.

The public product price includes enough margin for the reward when a referred sale occurs.

#### Fairness rule

- On a direct order with no referrer, the seller receives at least the minimum take-home and may receive the unused referral margin as additional seller proceeds.
- On a referred order, the seller receives the configured minimum take-home and the reward amount funds the referrer’s store credit.
- On an order where a reward credit is redeemed, that discounted order does not generate another reward in Version 1.
- Reward stacking is not allowed in Version 1.

This avoids promising two rewards from one funded margin.

### 7.14 Reward redemption

At checkout, a buyer can enter or automatically apply one valid reward code.

Validation requires:

- same seller;
- same normalized phone number as the reward owner;
- available status;
- not expired;
- not already redeemed;
- amount within campaign limits;
- no conflicting referral reward generation.

The buyer sees:

```text
Item total       ₦10,800
Reward applied     -₦300
Delivery            ₦0
Final total       ₦10,500
```

The seller must still receive their configured minimum take-home.

### 7.15 Order tracking

The buyer order page displays:

- seller identity and WhatsApp contact;
- product and variation;
- amount paid;
- outstanding balance;
- order status;
- status timeline;
- fulfilment method;
- pickup/delivery note;
- seller message;
- referral and reward status;
- receipt download/print action.

Order statuses:

```text
payment_pending
partially_paid
paid
confirmed
processing
awaiting_stock
ready_for_pickup
out_for_delivery
delivered
picked_up
cancelled
refund_pending
partially_refunded
refunded
payment_failed
expired
```

Every status change creates an immutable order event.

### 7.16 Seller order management

The seller can:

- view all orders;
- filter by status, campaign, date and buyer;
- search by name, phone or order reference;
- see payment status;
- see variant and quantity;
- see referrer attribution;
- see reward liability;
- update fulfilment status;
- add a private note;
- add a buyer-visible message;
- generate balance-payment link;
- cancel an unpaid reservation;
- initiate a refund request where permitted;
- resend/copy an order-status link;
- open a prewritten WhatsApp follow-up message;
- export CSV.

### 7.17 Follow-up assistant without AI

The dashboard should surface deterministic reminders:

- unpaid reservation expiring today;
- outstanding balance due;
- order paid but not confirmed;
- order ready but not picked up;
- preorder deadline approaching;
- restock requests waiting;
- reward earned but not sent to buyer;
- product almost out of stock.

Each reminder has a one-tap action and optional prewritten WhatsApp message.

No external AI or WhatsApp API is required.

### 7.18 Restock interest

When a variation is unavailable, the buyer can submit:

- name;
- phone;
- desired colour/size;
- desired quantity;
- optional maximum acceptable price.

This creates a restock-interest record for the seller.

The seller dashboard groups demand by product, colour and size.

The seller can copy a prewritten WhatsApp message when stock returns.

This directly supports vendors who currently keep requests in memory, notebooks and chats.

### 7.19 Substitution offer

For unavailable variations, the seller can offer:

- another colour;
- another size;
- a similar product;
- adjusted price;
- refund/cancellation.

The buyer opens the order link and accepts or rejects the offer.

Every decision is recorded.

### 7.20 Customer history

Within each seller’s private dashboard, group orders by normalized phone number.

Display:

- buyer name;
- order count;
- total purchased;
- last order date;
- preferred sizes/colours inferred only from actual purchases;
- rewards earned/redeemed;
- open balances;
- referral sales generated.

Do not create cross-seller customer profiles visible to sellers.

### 7.21 Seller reports

Version 1 reports:

#### Today

- paid orders;
- gross sales;
- seller expected proceeds;
- new buyers;
- referred buyers;
- pending fulfilment.

#### Weekly

- sales by campaign;
- sales by variation;
- direct versus referred orders;
- referral conversion;
- top customer referrers;
- outstanding balances;
- estimated profit when purchase cost exists;
- products with restock demand.

#### Profit estimate

```text
Estimated profit = seller proceeds - seller-entered purchase cost - seller-entered delivery cost
```

Label this as an estimate. Do not present it as accounting or tax advice.

---

## 8. Seller Experience

### 8.1 Seller landing page

Hero copy:

> Your WhatsApp customers can bring your next customers.

Supporting copy:

> Create a smart product link, receive secure payments, record every order and reward buyers who create real sales.

Primary CTA:

> Create my first sales link

Secondary CTA:

> See how it works

Three steps:

1. Add one product.
2. Share it on WhatsApp.
3. Let buyers buy, track and refer.

Do not lead with “fees,” “affiliate marketing,” “e-commerce platform” or “software.”

### 8.2 Seller dashboard hierarchy

The first screen must answer:

1. How much did I sell?
2. Which orders need my attention?
3. How many new buyers came from referrals?
4. What should I post next?

Recommended dashboard order:

- greeting and “Create sales link” CTA;
- today’s sales card;
- new customers from referrals;
- orders requiring action;
- active campaigns;
- restock demand;
- weekly summary;
- simple tips.

### 8.3 Campaign creation flow

Use four short screens, not one long form.

#### Screen 1 — What are you selling?

- image;
- title;
- category;
- description.

#### Screen 2 — Options and stock

- colours;
- sizes;
- quantity;
- stock mode.

#### Screen 3 — Price and buyer reward

- “How much must you receive?”
- optional cost price;
- referral reward slider/input;
- pricing preview.

Preview:

```text
You receive at least       ₦10,000
Buyer sees                  ₦10,800
Buyer can earn                 ₦300
Secure payment + SKWER MKT included
Estimated profit             ₦2,000
```

#### Screen 4 — Delivery and publish

- pickup/delivery;
- policy;
- campaign deadline;
- preview;
- publish and share.

### 8.4 Empty states

Empty states must teach one action.

Examples:

> No sales links yet. Add one product and share it today.

> No orders yet. Your link is ready—post it on WhatsApp Status.

> No referral sales yet. Buyers receive their personal sharing link after payment.

Avoid empty dashboards filled with complex charts.

---

## 9. Buyer Experience

### 9.1 Buyer design goal

A first-time buyer should understand the page within three seconds:

- who is selling;
- what is being sold;
- how much it costs;
- how to choose the right option;
- how to pay;
- what reward can be earned.

### 9.2 Buyer trust hierarchy

Trust should come from:

1. The seller they already know.
2. The seller’s business identity.
3. Clear product information.
4. Real customer photographs/testimonials with permission.
5. One consistent final price.
6. Paystack-hosted payment.
7. Clear fulfilment and refund policy.
8. Order tracking after payment.

Do not over-brand SKWER MKT above the seller. The seller remains the merchant relationship the buyer recognizes.

### 9.3 Buyer fun and delight

Use:

- smooth variation selection;
- immediate image updates;
- clear stock feedback;
- brief confetti after verified payment;
- a referral card personalized with the buyer’s first name;
- progress labels such as “Friend purchased—reward pending”;
- a satisfying reward-unlocked state;
- share-card preview before posting;
- lightweight micro-interactions.

Do not use:

- spinning wheels;
- gambling-style mechanics;
- random rewards;
- forced notifications;
- misleading countdowns;
- obstructive pop-ups.

### 9.4 Buyer referral page

The page should say:

> Your order is confirmed.
>
> Share this product. When a new buyer completes an eligible order through your link, you earn ₦500 off your next purchase from [Seller Name].

Buttons:

- Share on WhatsApp;
- Copy my link;
- Download Status card;
- View my order;
- Check my reward.

The buyer should never need to understand “affiliate attribution.”

---

## 10. Pricing and Revenue System

### 10.1 Goals

The pricing system must ensure:

- the buyer sees one final price;
- the seller receives at least the amount they requested;
- Paystack fees are covered;
- SKWER MKT earns revenue;
- referred-order rewards are funded;
- calculations are done server-side;
- historical orders retain their original pricing snapshot;
- admin can change future fees without deployment.

### 10.2 Money storage rules

- Store all monetary amounts as integer kobo.
- Never use floating-point values for money.
- Currency for Version 1 is NGN only.
- Every checkout stores a complete immutable pricing snapshot.

### 10.3 Seller pricing inputs

Required:

- `seller_minimum_take_home_kobo`.

Optional:

- `seller_purchase_cost_kobo`;
- `referral_reward_kobo`;
- `delivery_fee_kobo`;
- `deposit_amount` or `deposit_percentage`.

### 10.4 Admin fee configuration

Admin controls:

- Paystack percentage estimate;
- Paystack fixed fee;
- fixed-fee threshold;
- Paystack fee cap;
- VAT or other applicable fee factor where required;
- SKWER MKT flat fee;
- SKWER MKT percentage fee;
- minimum SKWER MKT fee;
- maximum SKWER MKT fee;
- pricing safety buffer;
- rounding increment;
- reward minimum;
- reward maximum;
- reward percentage maximum;
- category-specific overrides;
- seller-specific pilot overrides;
- effective date;
- active/inactive state.

Do not rely permanently on hardcoded Paystack rates. The admin configuration must be changeable because payment-provider pricing changes.

### 10.5 Gross-up calculation

The server must find the smallest rounded gross amount such that:

```text
Gross amount
- actual/estimated Paystack fee
- SKWER MKT platform revenue
- reward funding when applicable
>= seller minimum take-home
```

Use a deterministic iterative or piecewise gross-up function because payment fees can contain percentage, fixed, threshold and cap components.

Pseudo-code:

```ts
function calculatePublicPrice(input, feeConfig) {
  const required =
    input.sellerMinimumTakeHome +
    feeConfig.platformFee(input.sellerMinimumTakeHome) +
    input.referralReward;

  let gross = roundUp(required, feeConfig.roundingIncrement);

  while (
    gross - feeConfig.paystackFee(gross) < required
  ) {
    gross += feeConfig.roundingIncrement;
  }

  return gross;
}
```

The production implementation must include exact platform-share and seller-share calculations, not only this simplified example.

### 10.6 Example

Seller requests:

```text
Minimum seller take-home: ₦10,000
Referral reward:             ₦300
```

Assume the configured final public price is:

```text
Buyer sees:                ₦10,800
```

On a referred order, an illustrative outcome may be:

```text
Seller settlement target:  ₦10,000
Reward funding:                ₦300
Paystack processing:           ~₦262
SKWER MKT revenue:              ~₦238
```

Exact values must be calculated from the current live fee configuration and Paystack transaction result.

### 10.7 Buyer transparency

Allowed:

```text
Product: ₦10,800
Delivery: ₦1,000
Total: ₦11,800
```

Not allowed:

```text
Product advertised as ₦10,000
Unexpected “service fee” added at checkout: ₦800
```

The first is inclusive pricing. The second is deceptive pricing and must never be implemented.

### 10.8 Seller transparency

The seller sees:

- public price;
- minimum seller settlement;
- direct-order potential extra margin;
- referral reward amount;
- estimated Paystack processing;
- SKWER MKT amount;
- expected profit estimate;
- effect of deposits and reward redemption.

### 10.9 Refund economics

When an order is refunded:

- reverse pending referral attribution;
- reverse unredeemed reward created by that order;
- flag redeemed rewards for manual review or seller/platform loss policy;
- store Paystack refund reference;
- never silently deduct from unrelated seller orders;
- display the financial effect to admin and seller.

Refund policy must be finalized with Paystack and legal/accounting advice before live scale.

---

## 11. Paystack Architecture

### 11.1 Recommended production model

Use Paystack split payments with a seller subaccount where Paystack approves the business model.

The platform initializes a transaction with:

- buyer email;
- amount in kobo;
- seller `subaccount_code`;
- flat `transaction_charge` allocated to the main platform account;
- `bearer` configuration chosen to preserve the seller’s expected take-home;
- unique reference;
- metadata containing internal public-safe identifiers.

The main platform share can cover:

- Paystack processing where the main account bears it;
- SKWER MKT platform revenue;
- reward funding.

The seller subaccount receives the computed seller settlement.

### 11.2 Live-launch gate

Do not assume that a Paystack Starter Business automatically permits the final multi-vendor production structure.

Before enabling live multi-seller payments:

1. Describe the exact model to Paystack in writing.
2. Confirm that split payments and seller subaccounts are approved for the account.
3. Confirm required seller information and KYC.
4. Confirm who bears transaction fees.
5. Confirm refund and chargeback handling.
6. Confirm whether a Registered Business is required.
7. Confirm settlement timing.
8. Keep the approval record.

A Nigerian Paystack Starter Business has a lifetime collection limit. Therefore, Starter Business is a pilot path, not a permanent scaling strategy.

### 11.3 Payment initialization

Never initialize payment entirely from the browser.

Server flow:

1. Receive campaign, variant, quantity, buyer and fulfilment input.
2. Validate campaign status and stock.
3. Recalculate price from database values.
4. Validate reward/referral/discount.
5. Create pending order and inventory reservation.
6. Create unique payment reference.
7. Initialize Paystack transaction server-side.
8. Store Paystack access code and reference.
9. Return authorization URL.

### 11.4 Payment verification

A browser callback is not proof of payment.

On callback:

1. Send reference to server.
2. Server calls Paystack Verify Transaction.
3. Confirm status is successful.
4. Confirm amount equals expected amount.
5. Confirm currency is NGN.
6. Confirm reference belongs to the order.
7. Confirm transaction has not already been processed.
8. Mark payment successful in one database transaction.
9. Update order and reservation.
10. Create/refine referral attribution.
11. Return verified success page.

### 11.5 Webhook

Provide:

```text
POST /api/webhooks/paystack
```

Requirements:

- read raw request body;
- verify `x-paystack-signature` using HMAC SHA-512 with the Paystack secret key;
- store webhook event hash/reference;
- enforce idempotency;
- process relevant events;
- return quickly;
- move heavy internal work to safe asynchronous database jobs only where infrastructure supports it;
- log failures without exposing secrets.

### 11.6 Payment states

```text
initialized
pending
success
failed
abandoned
refund_pending
partially_refunded
refunded
chargeback
```

### 11.7 Paystack channels

Use Paystack-hosted checkout and enable approved Nigerian channels such as card, bank, transfer and USSD according to the live account’s configuration.

Do not promise every channel until it is enabled on the account.

---

## 12. Technical Architecture

### 12.1 Frontend framework

Use:

- Next.js App Router;
- React;
- TypeScript with strict mode;
- Tailwind CSS;
- accessible headless components or shadcn/ui-style local components;
- server components where appropriate;
- client components only for interaction-heavy areas.

Next.js is preferred over a plain SPA because SKWER MKT depends on:

- dynamic Open Graph previews;
- fast public product pages;
- server-only payment initialization;
- secure cookies;
- route handlers;
- SEO and social-sharing metadata.

Use current stable package versions at implementation time and commit a lockfile.

### 12.2 Backend

Use Supabase for:

- PostgreSQL database;
- Auth for sellers/admins;
- Storage for product and business media;
- Row Level Security;
- database functions and triggers;
- scheduled jobs only where necessary;
- local development through Supabase CLI.

Use Next.js route handlers or Supabase Edge Functions for secure server operations. Do not duplicate payment logic across both. Choose one authoritative payment service layer.

Recommended:

- Next.js route handlers for checkout, webhooks and public metadata;
- Supabase database/RLS for persistent data;
- database functions for atomic stock and reward operations.

### 12.3 Deployment

Recommended:

- Vercel for Next.js;
- Supabase hosted project;
- custom domain;
- Paystack live/test keys in server environment variables.

The product must also run locally without live external payment using Paystack test mode.

### 12.4 No external operational APIs in Version 1

Do not require:

- WhatsApp Business API;
- SMS API;
- AI API;
- delivery API;
- maps API;
- external image-generation API;
- external analytics SDK;
- affiliate network API.

Use:

- WhatsApp deep links;
- Web Share API;
- browser canvas for share cards;
- text pickup/delivery descriptions;
- first-party event tables for product analytics;
- Paystack as the only required third-party business API.

### 12.5 Suggested dependencies

Keep dependencies minimal.

Possible packages:

```text
@supabase/ssr
@supabase/supabase-js
zod
react-hook-form
@hookform/resolvers
nanoid
clsx
tailwind-merge
lucide-react
date-fns
recharts (only for seller reports if necessary)
qrcode (future/optional)
```

Use a bundled font package rather than loading a remote font at runtime.

Recommended font:

```text
@fontsource-variable/plus-jakarta-sans
```

### 12.6 Environment variables

```env
# Public
NEXT_PUBLIC_APP_NAME="SKWER MKT"
NEXT_PUBLIC_APP_SHORT_NAME="SKWER"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
# Server only
SUPABASE_SERVICE_ROLE_KEY=""
PAYSTACK_SECRET_KEY=""
ORDER_TOKEN_SECRET=""
REFERRAL_TOKEN_SECRET=""
CRON_SECRET=""

# Feature flags
PAYMENTS_ENABLED="false"
PAYSTACK_SPLIT_ENABLED="false"
SELLER_SIGNUP_MODE="invite_only"
REWARDS_ENABLED="true"
DEPOSITS_ENABLED="true"
RESTOCK_REQUESTS_ENABLED="true"
```

Never expose service-role or Paystack secret keys to the client.

---

## 13. Suggested Project Structure

```text
src/
  app/
    (marketing)/
      page.tsx
      how-it-works/page.tsx
      pricing/page.tsx
      privacy/page.tsx
      terms/page.tsx
      refunds/page.tsx
    (public)/
      p/[shortCode]/page.tsx
      r/[referralCode]/route.ts
      checkout/[sessionId]/page.tsx
      payment/callback/page.tsx
      order/[publicToken]/page.tsx
      reward/[publicToken]/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
    seller/
      onboarding/page.tsx
      dashboard/page.tsx
      campaigns/page.tsx
      campaigns/new/page.tsx
      campaigns/[id]/page.tsx
      orders/page.tsx
      orders/[id]/page.tsx
      customers/page.tsx
      reports/page.tsx
      settings/page.tsx
      settings/payments/page.tsx
    admin/
      dashboard/page.tsx
      sellers/page.tsx
      campaigns/page.tsx
      orders/page.tsx
      transactions/page.tsx
      rewards/page.tsx
      disputes/page.tsx
      pricing/page.tsx
      settings/page.tsx
    api/
      checkout/initialize/route.ts
      payments/verify/route.ts
      webhooks/paystack/route.ts
      orders/[id]/status/route.ts
      orders/[id]/balance-link/route.ts
      orders/[id]/substitution/route.ts
      rewards/validate/route.ts
      restock-interest/route.ts
      share-card/route.tsx
  components/
    ui/
    marketing/
    seller/
    buyer/
    campaigns/
    checkout/
    orders/
    rewards/
    reports/
  features/
    auth/
    sellers/
    campaigns/
    pricing/
    checkout/
    payments/
    orders/
    referrals/
    rewards/
    restock/
    reports/
  lib/
    supabase/
    paystack/
    pricing/
    security/
    tokens/
    validation/
    money/
    whatsapp/
    analytics/
  server/
    services/
    repositories/
    policies/
  types/
  styles/

supabase/
  migrations/
  seed.sql
  tests/

public/
  icons/
  brand/
  placeholders/

tests/
  unit/
  integration/
  e2e/
```

---

## 14. Database Design

Use UUID primary keys internally. Use separate opaque public tokens/codes externally.

### 14.1 `profiles`

Seller/admin user profile.

```text
id uuid primary key references auth.users
role enum(seller, admin, support)
full_name text
phone text
created_at timestamptz
updated_at timestamptz
```

### 14.2 `seller_businesses`

```text
id uuid primary key
owner_profile_id uuid unique
business_name text
slug text unique
category text
logo_path text nullable
whatsapp_phone text
email text
city text
state text
short_description text
pickup_note text
return_policy text
is_active boolean
is_approved boolean
created_at timestamptz
updated_at timestamptz
```

### 14.3 `seller_payment_accounts`

```text
id uuid primary key
seller_id uuid unique
provider text default 'paystack'
bank_code text
account_number_last4 text
account_name text
subaccount_code text encrypted/server-only
provider_verified boolean
status enum(pending, active, rejected, disabled)
metadata jsonb
created_at timestamptz
updated_at timestamptz
```

Never expose full bank account numbers publicly.

### 14.4 `products`

```text
id uuid primary key
seller_id uuid
name text
description text
category text
status enum(draft, active, archived)
created_at timestamptz
updated_at timestamptz
```

### 14.5 `product_media`

```text
id uuid primary key
product_id uuid
storage_path text
media_type enum(image, video)
sort_order int
alt_text text
consent_confirmed boolean default false
created_at timestamptz
```

### 14.6 `product_variants`

```text
id uuid primary key
product_id uuid
sku text nullable
option_1_name text nullable
option_1_value text nullable
option_2_name text nullable
option_2_value text nullable
available_quantity int nullable
reserved_quantity int default 0
seller_take_home_override_kobo bigint nullable
is_active boolean
created_at timestamptz
updated_at timestamptz
```

### 14.7 `campaigns`

```text
id uuid primary key
seller_id uuid
product_id uuid
short_code text unique
status enum(draft, active, paused, sold_out, ended, archived)
stock_mode enum(fixed, on_request, preorder)
payment_mode enum(full, fixed_deposit, percentage_deposit)
deposit_value int nullable
seller_minimum_take_home_kobo bigint
seller_purchase_cost_kobo bigint nullable
referral_reward_kobo bigint default 0
public_price_kobo bigint
reservation_minutes int
starts_at timestamptz
ends_at timestamptz nullable
expected_fulfilment_at timestamptz nullable
allow_restock_interest boolean
allow_substitution boolean
chat_fallback_enabled boolean
pricing_snapshot jsonb
created_at timestamptz
updated_at timestamptz
```

### 14.8 `customers`

Platform-private buyer identity.

```text
id uuid primary key
full_name text
normalized_phone text
email text
created_at timestamptz
updated_at timestamptz
```

Deduplication must be cautious. Do not merge people solely because names match.

### 14.9 `seller_customers`

Seller-isolated customer relationship.

```text
id uuid primary key
seller_id uuid
customer_id uuid
first_order_at timestamptz
last_order_at timestamptz
completed_order_count int
total_paid_kobo bigint
notes text nullable
unique(seller_id, customer_id)
```

### 14.10 `orders`

```text
id uuid primary key
public_token_hash text unique
public_reference text unique
seller_id uuid
customer_id uuid
campaign_id uuid
status order_status
fulfilment_method enum(pickup, seller_delivery, dispatch, waybill, meet_up, other)
delivery_address text nullable
delivery_fee_kobo bigint default 0
item_subtotal_kobo bigint
discount_kobo bigint default 0
total_due_kobo bigint
total_paid_kobo bigint default 0
seller_target_kobo bigint
platform_target_kobo bigint
reward_funding_kobo bigint default 0
paystack_fee_estimate_kobo bigint
currency text default 'NGN'
buyer_note text nullable
seller_private_note text nullable
seller_buyer_message text nullable
referred_by_referral_id uuid nullable
reward_redemption_id uuid nullable
pricing_snapshot jsonb
created_at timestamptz
updated_at timestamptz
```

### 14.11 `order_items`

```text
id uuid primary key
order_id uuid
product_id uuid
variant_id uuid nullable
product_name_snapshot text
variant_snapshot jsonb
quantity int
unit_public_price_kobo bigint
unit_seller_target_kobo bigint
created_at timestamptz
```

### 14.12 `inventory_reservations`

```text
id uuid primary key
order_id uuid
variant_id uuid
quantity int
status enum(active, converted, released, expired)
expires_at timestamptz
created_at timestamptz
updated_at timestamptz
```

Use an atomic database function to reserve/release stock.

### 14.13 `payments`

```text
id uuid primary key
order_id uuid
provider text
provider_reference text unique
status payment_status
amount_kobo bigint
currency text
payment_type enum(deposit, balance, full)
authorization_url text nullable
provider_transaction_id text nullable
provider_channel text nullable
provider_paid_at timestamptz nullable
raw_verified_summary jsonb
processed_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

Do not store sensitive card information.

### 14.14 `payment_webhook_events`

```text
id uuid primary key
provider text
event_key text unique
event_type text
signature_valid boolean
payload jsonb
processing_status enum(received, processed, ignored, failed)
error_message text nullable
received_at timestamptz
processed_at timestamptz nullable
```

### 14.15 `referral_links`

```text
id uuid primary key
public_code text unique
seller_id uuid
campaign_id uuid
referrer_customer_id uuid
originating_order_id uuid
status enum(active, expired, blocked)
attribution_expires_at timestamptz
created_at timestamptz
```

### 14.16 `referral_attributions`

```text
id uuid primary key
referral_link_id uuid
referred_customer_id uuid nullable
order_id uuid unique
status enum(visited, checkout_started, paid, qualified, rejected, reversed)
first_seen_at timestamptz
paid_at timestamptz nullable
qualified_at timestamptz nullable
fraud_reason text nullable
signals jsonb
created_at timestamptz
updated_at timestamptz
```

### 14.17 `reward_credits`

```text
id uuid primary key
public_code_hash text unique
seller_id uuid
owner_customer_id uuid
source_order_id uuid
source_referral_attribution_id uuid
amount_kobo bigint
status reward_status
available_at timestamptz nullable
expires_at timestamptz nullable
redeemed_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

### 14.18 `reward_redemptions`

```text
id uuid primary key
reward_credit_id uuid unique
order_id uuid unique
amount_kobo bigint
created_at timestamptz
```

### 14.19 `order_events`

```text
id uuid primary key
order_id uuid
event_type text
from_status text nullable
to_status text nullable
actor_type enum(system, buyer, seller, admin, paystack)
actor_id uuid nullable
public_message text nullable
private_metadata jsonb
created_at timestamptz
```

### 14.20 `restock_interests`

```text
id uuid primary key
seller_id uuid
campaign_id uuid
customer_id uuid
variant_request jsonb
quantity int
maximum_price_kobo bigint nullable
status enum(waiting, contacted, converted, closed)
created_at timestamptz
updated_at timestamptz
```

### 14.21 `substitution_offers`

```text
id uuid primary key
order_id uuid
seller_id uuid
offer_type enum(colour, size, similar_product, price_adjustment, refund)
details jsonb
price_difference_kobo bigint default 0
status enum(pending, accepted, rejected, expired, withdrawn)
expires_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

### 14.22 `fee_configs`

```text
id uuid primary key
name text
currency text
paystack_percent_basis_points int
paystack_fixed_kobo bigint
paystack_fixed_threshold_kobo bigint
paystack_cap_kobo bigint
platform_percent_basis_points int
platform_flat_kobo bigint
platform_min_kobo bigint
platform_max_kobo bigint nullable
rounding_increment_kobo bigint
reward_min_kobo bigint
reward_max_kobo bigint
reward_max_percent_basis_points int
effective_from timestamptz
effective_to timestamptz nullable
is_active boolean
created_by uuid
created_at timestamptz
```

### 14.23 `audit_logs`

Record sensitive admin and seller actions.

```text
id uuid primary key
actor_profile_id uuid nullable
action text
resource_type text
resource_id uuid nullable
before_data jsonb nullable
after_data jsonb nullable
ip_hash text nullable
user_agent text nullable
created_at timestamptz
```

### 14.24 `feature_flags`

```text
key text primary key
enabled boolean
configuration jsonb
updated_by uuid
updated_at timestamptz
```

---

## 15. Row Level Security

Enable RLS on every user/business table.

### Seller rules

A seller can:

- read/update only their own profile and business;
- CRUD only their own products, campaigns and media;
- read only orders belonging to their business;
- update only allowed order fields;
- read only their seller-customer relationships;
- read only their own reports and restock interests;
- never directly update payment success, reward qualification or settlement amounts.

### Buyer rules

Anonymous buyers must not receive broad table access.

Public pages should use:

- carefully scoped server queries;
- secure RPCs;
- public-safe views;
- opaque token validation.

A public order token grants access only to the public-safe representation of one order.

### Admin rules

Admin access must be enforced server-side using role claims and database checks. Hiding admin links in the UI is not authorization.

### Service role

Use service role only inside trusted server functions for:

- payment processing;
- webhook processing;
- reward qualification;
- atomic stock changes;
- admin operations.

---

## 16. Security Requirements

### 16.1 Server-authoritative pricing

Never trust from the browser:

- public price;
- seller target;
- platform fee;
- reward amount;
- discount amount;
- delivery amount;
- stock availability;
- seller subaccount code.

The server reloads and recalculates all values.

### 16.2 Idempotency

Payment and webhook handlers must be idempotent.

A Paystack reference can create a successful payment effect only once.

Use:

- unique provider reference;
- database transaction;
- row lock or atomic function;
- processed timestamp;
- webhook event uniqueness.

### 16.3 Referral fraud controls

Version 1 signals:

- same normalized phone as referrer;
- same email as referrer;
- same order contact;
- same hashed IP within suspicious interval;
- same browser/device identifier where consent permits;
- repeated self-referrals;
- unusual reward velocity;
- excessive orders from one device;
- refund pattern;
- seller and buyer relationship abuse.

Do not automatically reject solely because users share a household IP. Use combined signals and allow admin review.

### 16.4 Rate limiting

Rate-limit:

- checkout initialization;
- referral redirects;
- reward validation;
- restock requests;
- login attempts;
- public token lookup;
- webhook retries by event key.

### 16.5 File uploads

- validate MIME type and extension;
- limit image and video size;
- compress images in browser before upload;
- generate safe filenames;
- use private buckets where media is not public;
- strip unnecessary metadata where feasible;
- prohibit executable content;
- moderate reported content;
- require seller confirmation that customer photos can be displayed.

### 16.6 Tokens

- public order and reward tokens must be cryptographically random;
- store hashes for bearer-style secret tokens where appropriate;
- never expose sequential IDs;
- support token rotation/revocation.

### 16.7 Secrets

- no secrets in client bundles;
- no service-role key in browser;
- no Paystack secret in frontend;
- rotate compromised keys;
- use separate test and live projects/environments.

---

*Then for image or media storage , just a simple supabase storage as the platform won't be storage or media choked as WhatsApp already does that , any media uploaded via my link are temp cus as soon as the particular campaign is closed the media is deleted  normally , so no heavy storage , but still in. case add a switch to cloudinary in the media upload module which if on service stops working we use another, so more like a toggle and easily overwritten using env variable if media upload is storage or cloudinary. ensure the process is really reliable and scalable and fast, no one will notice a switch even when a media is to be deleted.*

## 17. Privacy and Data Protection

SKWER MKT processes names, phone numbers, email addresses, addresses, order histories and device/security information. It must be designed under Nigeria’s data-protection requirements.

Minimum requirements:

- clear privacy notice;
- lawful purpose for every collected field;
- data minimization;
- clear buyer notice before checkout;
- consent where required;
- ability to object to direct marketing;
- seller access limited to their own customer relationships;
- deletion/anonymization workflow where legally possible;
- documented retention periods;
- access and correction process;
- security and breach-response plan;
- vendor consent for customer photographs/testimonials;
- no sale of customer contact lists;
- no cross-seller marketing without separate consent;
- record of significant data incidents.

Suggested retention policy for Version 1, subject to legal/accounting review:

- order/payment records: retain according to legal and accounting requirements;
- abandoned checkout personal data: delete or anonymize after 30–90 days;
- security logs: retain for a limited documented period;
- restock interest: remove after closure or inactivity;
- public tokens: revoke when no longer needed while preserving internal records.

Do not use buyers’ phone numbers for SKWER MKT marketing merely because they purchased from a seller.

---

## 18. Seller and Product Compliance

Before live launch, publish:

- Terms of Service;
- Seller Terms;
- Buyer Terms;
- Privacy Policy;
- Refund and Cancellation Policy;
- Prohibited Products Policy;
- Referral Reward Terms;
- Dispute Policy;
- Content and Customer-photo consent rules.

Prohibit at minimum:

- illegal goods;
- counterfeit goods;
- controlled substances;
- weapons;
- stolen goods;
- deceptive products;
- products prohibited by Paystack;
- misleading claims;
- false testimonials;
- unauthorized customer photographs.

SKWER MKT should make clear that the seller is responsible for product quality, availability, fulfilment and lawful trade, while SKWER MKT is responsible for its software, payment integration and stated platform processes.

---

## 19. Design System

### 19.1 Brand personality

SKWER MKT should feel:

- energetic;
- friendly;
- trustworthy;
- modern Nigerian;
- commercially useful;
- simple;
- not corporate-heavy;
- not childish;
- not like a betting application;
- not like a bank dashboard.

### 19.2 Logo direction

Working concept:

- four slightly offset corner shapes forming an open square;
- one corner becomes an outward arrow, representing sharing;
- one small dot represents the next customer;
- strong wordmark: `SKWER MKT`;
- logo must work in one colour;
- avoid close imitation of Marketsquare branding.

### 19.3 Colour palette

#### Primary — Market Lime

```text
#B9F34A
```

Use for:

- primary CTA background;
- success highlights;
- referral/reward emphasis;
- active states.

Use dark text on it.

#### Primary dark — Ink

```text
#111827
```

Use for:

- headings;
- navigation;
- high-contrast text;
- logo wordmark.

#### Background — Warm Paper

```text
#FFFCF5
```

Use as the main light background.

#### Surface — White

```text
#FFFFFF
```

Use for cards and forms.

#### Accent — Coral

```text
#FF6B57
```

Use sparingly for:

- urgency;
- campaign ending;
- buyer delight;
- selected decorative elements.

#### Information — Sky

```text
#DDF4FF
```

Use for helpful notices and order information.

#### Success

```text
#15803D
```

#### Warning

```text
#B45309
```

#### Error

```text
#DC2626
```

#### Muted text

```text
#667085
```

#### Border

```text
#E5E7EB
```

### 19.4 Dark mode

Dark mode is not required for the initial public buyer experience. Sellers may receive dark mode in Version 1.1.

If implemented:

```text
Background: #0B0F14
Surface: #121821
Text: #F8FAFC
Muted: #98A2B3
Border: #273142
Primary lime remains #B9F34A
```

### 19.5 Typography

Primary font:

```text
Plus Jakarta Sans Variable
```

Bundle locally through npm.

Scale:

```text
Display: 40/48, weight 750
H1: 32/40, weight 750
H2: 26/34, weight 700
H3: 21/28, weight 700
Body large: 18/28, weight 450
Body: 16/24, weight 450
Small: 14/20, weight 500
Caption: 12/16, weight 600
```

Do not use text below 12px.

### 19.6 Shape and spacing

- base spacing unit: 4px;
- common page gutter: 16px mobile, 24px tablet, 32px desktop;
- card radius: 18px;
- button radius: 14px;
- input radius: 12px;
- pill radius: 999px;
- minimum touch target: 44px;
- use shadows lightly;
- avoid dense desktop-style tables on mobile.

### 19.7 Buttons

Primary:

- lime background;
- ink text;
- full-width on mobile checkout;
- clear action verb.

Secondary:

- white/transparent;
- dark border;
- ink text.

Destructive:

- red only for real destructive actions.

Button copy examples:

- Create sales link
- Publish and share
- Buy now
- Pay securely
- Share and earn
- Copy order link
- Mark ready for pickup

Avoid vague buttons such as “Continue” when a more precise label is possible.

### 19.8 Accessibility

- WCAG AA colour contrast;
- keyboard support;
- visible focus indicators;
- semantic headings;
- form labels, not placeholders alone;
- error summary and inline errors;
- reduced-motion support;
- alt text for product images;
- screen-reader status announcements after payment/status changes;
- no colour-only status meaning.

---

## 20. Performance Requirements

Design for low-cost Android phones and mobile networks.

Targets:

- public product page usable on slow 3G;
- initial critical content under 200 KB compressed where practical;
- product hero image responsive and compressed;
- lazy-load noncritical images;
- avoid autoplay video;
- no large chart libraries on buyer pages;
- minimal JavaScript on public pages;
- cache public campaign data safely;
- invalidate cache when stock/status changes;
- Lighthouse mobile targets after production optimization:
  - Performance ≥ 85;
  - Accessibility ≥ 95;
  - Best Practices ≥ 90;
  - SEO ≥ 90.

The Buy button and price must appear before nonessential scripts finish.

---

## 21. Analytics

Do not rely on third-party analytics in Version 1. Store first-party events.

### 21.1 North-star metric

> Number of completed orders from new buyers attributed to existing buyer referrals.

### 21.2 Seller activation

A seller is activated when they:

1. complete onboarding;
2. publish a campaign;
3. share the link;
4. receive the first verified payment.

### 21.3 Key metrics

- sellers invited;
- sellers activated;
- time to first campaign;
- time to first verified payment;
- product-page views;
- checkout starts;
- payment completion rate;
- buyer share rate;
- referral-link visit rate;
- referred checkout rate;
- referred purchase rate;
- qualified reward rate;
- reward redemption rate;
- new buyers per existing buyer;
- seller weekly retention;
- percentage of seller orders paid through SKWER MKT;
- restock requests converted;
- unpaid reservation recovery;
- refund rate;
- failed-payment rate.

### 21.4 Event examples

```text
campaign_viewed
variant_selected
checkout_started
paystack_initialized
payment_verified
order_created
order_status_changed
share_clicked
share_card_downloaded
referral_opened
referral_checkout_started
referral_order_paid
reward_pending
reward_available
reward_redeemed
restock_interest_submitted
substitution_offered
substitution_accepted
```

Do not store unnecessary sensitive values inside analytics events.

---

## 22. Admin Console

### 22.1 Dashboard

Show:

- gross merchandise value;
- successful transaction count;
- SKWER MKT revenue;
- pending reward liability;
- seller settlement totals;
- active sellers;
- active campaigns;
- direct versus referred orders;
- refund/dispute count;
- payment failure rate;
- sellers awaiting approval.

### 22.2 Seller management

Admin can:

- invite seller;
- approve/reject/suspend seller;
- review business and payment status;
- view seller metrics;
- set seller-specific fee override;
- disable payments;
- view audit trail.

### 22.3 Pricing management

Admin can:

- create a new versioned fee configuration;
- preview calculations at common price points;
- set effective date;
- test seller take-home;
- prevent configurations that produce negative platform margin;
- view campaigns using old configurations;
- never retroactively alter existing orders.

### 22.4 Transaction management

- search reference;
- compare expected and verified amount;
- view webhook status;
- retry safe internal processing;
- record refund;
- export reconciliation file;
- flag mismatches.

### 22.5 Referral/reward management

- inspect attribution path;
- approve/reject suspicious reward;
- reverse reward after refund;
- view self-referral signals;
- view reward liability;
- manually issue goodwill promotional credit with audit log.

### 22.6 Content moderation

- review reported campaign;
- pause campaign;
- suspend seller;
- record reason;
- preserve evidence and audit history.

---

## 23. Notifications Without External Messaging APIs

Version 1 must work without SMS, email-marketing or WhatsApp APIs.

Use:

- in-app seller notification centre;
- dashboard attention cards;
- buyer order/reward page;
- copyable WhatsApp message templates;
- WhatsApp deep links initiated by the seller/buyer;
- browser local reminders where permission exists;
- Paystack’s own payment receipt where available.

Seller message templates:

### Payment confirmed

```text
Hello {buyer_name}, your payment for {product_name} has been confirmed. Your order number is {order_reference}. You can track it here: {order_link}
```

### Ready for pickup

```text
Hello {buyer_name}, your {product_name} is ready for pickup. Details: {order_link}
```

### Balance reminder

```text
Hello {buyer_name}, your remaining balance for {product_name} is {balance}. You can complete it securely here: {balance_link}
```

### Restocked

```text
Hello {buyer_name}, the {product_name} you requested is now available. You can order it here: {campaign_link}
```

### Reward available

```text
Good news, {buyer_name}. Your friend completed an order through your link, so your {reward_amount} reward from {seller_name} is now available. Check it here: {reward_link}
```

---

## 24. Search and Social Metadata

Each public product page should have:

- canonical URL;
- title using product and seller;
- description;
- Open Graph image;
- Twitter card metadata;
- product structured data only when accurate;
- `noindex` option for private campaigns;
- campaign expiry handling;
- sold-out metadata update.

Do not allow search indexing of:

- buyer order pages;
- checkout sessions;
- reward pages;
- seller dashboards;
- admin routes.

---

## 25. Testing Strategy

### 25.1 Unit tests

Test:

- money rounding;
- Paystack-fee estimation;
- gross-up pricing;
- platform margin;
- reward eligibility;
- reward redemption;
- attribution-window rules;
- self-referral detection;
- order-state transitions;
- stock reservation;
- deposit calculations;
- token generation/verification.

### 25.2 Integration tests

Test:

- campaign creation with RLS;
- anonymous public product read;
- checkout initialization;
- Paystack verification mock;
- duplicate webhook processing;
- successful stock conversion;
- payment amount mismatch;
- reward creation after qualifying order;
- refund reversal;
- seller isolation;
- public order token scope.

### 25.3 End-to-end tests

Use Playwright.

Critical paths:

1. Seller registers and creates campaign.
2. Seller shares/opens public link.
3. Buyer checks out without account.
4. Paystack test payment succeeds.
5. Order appears in seller dashboard.
6. Buyer receives referral link.
7. Second buyer purchases through referral.
8. Seller marks referred order fulfilled.
9. Reward becomes available.
10. First buyer redeems reward on later purchase.
11. Seller still receives configured minimum.
12. Admin sees correct revenue and reward liability.

### 25.4 Failure tests

- payment abandoned;
- Paystack callback without webhook;
- webhook before callback;
- webhook replay;
- wrong amount;
- sold-out variation during checkout;
- network interruption;
- duplicate Buy clicks;
- expired reservation;
- reward code reuse;
- self-referral;
- refunded referred order;
- seller suspension;
- invalid public token.

### 25.5 Device testing

At minimum:

- low-end Android Chrome;
- modern Android Chrome;
- iPhone Safari;
- desktop Chrome;
- WhatsApp in-app browser;
- Instagram in-app browser where practical.

---

## 26. Version 1 Acceptance Criteria

Version 1 is complete only when:

### Seller

- invited seller can onboard;
- seller can create one campaign in under five minutes;
- seller sees exact pricing breakdown;
- seller can publish and share a dynamic product preview;
- seller can see and manage paid orders;
- seller can update status;
- seller can view basic sales/referral report;
- seller can export orders;
- seller can see restock interest;
- seller can send copyable follow-up messages.

### Buyer

- buyer can open a product link without login;
- buyer sees seller, product, price and reward immediately;
- buyer can choose variation;
- buyer can pay through Paystack;
- payment is verified server-side;
- buyer receives an order tracking link;
- buyer can share a personal referral link;
- referred purchase is attributed;
- reward can become available and be redeemed;
- buyer never receives a surprise checkout fee.

### Admin

- admin can configure fees;
- admin can approve sellers;
- admin can reconcile payments;
- admin can review rewards and fraud flags;
- admin can suspend campaigns/sellers;
- all sensitive actions are audited.

### Quality

- RLS tests pass;
- payment idempotency tests pass;
- mobile product page meets performance target;
- no secrets appear in client bundle;
- privacy, terms, reward and refund pages exist;
- live payments remain disabled until compliance gate is passed.

---

## 27. Pilot Plan With the Four Vendors

### 27.1 Pilot constraints

- invite-only;
- one to three products per seller;
- small reward values;
- no public seller marketplace;
- no cash rewards;
- manual support available;
- Paystack test mode first;
- live mode only after approved settlement setup.

### 27.2 Pilot categories

- one makeup campaign;
- two clothing campaigns;
- one household-item campaign.

### 27.3 Pilot questions

Observe behaviour, not compliments.

Measure:

- Did the seller create a second campaign without being asked?
- Did the seller send the payment link instead of account details?
- Did buyers complete Paystack payment?
- Did buyers share referral links?
- Did referrals create genuinely new buyers?
- Did order tracking reduce repeated questions?
- Did the seller use the dashboard instead of a notebook/chat search?
- Did the seller ask to continue using it?
- Did the margin remain acceptable after all fees and rewards?

### 27.4 Pilot success thresholds

Suggested initial signals, not universal truths:

- all four sellers publish at least one campaign;
- at least three sellers receive a verified payment;
- at least 25% of successful buyers click a share action;
- at least 10% of buyers generate a referral visit;
- at least one referred paid order per active seller during pilot;
- no seller loses expected take-home;
- payment completion rate is acceptable relative to checkout starts;
- at least two sellers voluntarily publish another product;
- sellers report reduced order/payment confusion.

If buyer sharing is weak but checkout/order utility is strong, reposition Version 1 around “smart WhatsApp payment and order links” while continuing to test better referral incentives.

---

## 28. Implementation Roadmap

### Phase 0 — Validation and setup

- finalize working brand and configuration;
- obtain domain;
- create Supabase and Paystack test accounts;
- confirm payment/compliance path;
- create clickable buyer and seller prototype;
- test wording with four sellers;
- define prohibited categories;
- create initial policies.

### Phase 1 — Foundation

- Next.js project;
- Tailwind and design tokens;
- Supabase Auth;
- database migrations;
- RLS;
- seller profile;
- admin role;
- invite-only signup;
- audit logging foundation.

### Phase 2 — Campaign and sharing

- products;
- media upload;
- variations;
- pricing calculator;
- campaign builder;
- public product page;
- Open Graph image;
- WhatsApp sharing;
- share-card download.

### Phase 3 — Checkout and payments

- guest checkout;
- stock reservation;
- pending orders;
- Paystack initialization;
- callback verification;
- webhook verification;
- payment/order state machine;
- order tracking;
- receipt view;
- deposit/balance flow.

### Phase 4 — Referrals and rewards

- referral codes;
- attribution cookies;
- fraud signals;
- reward funding snapshot;
- pending/available reward;
- reward code;
- redemption;
- reversal;
- buyer referral page.

### Phase 5 — Seller operations

- order dashboard;
- status changes;
- follow-up assistant;
- restock interest;
- substitution offers;
- customer history;
- reports;
- exports.

### Phase 6 — Admin and launch hardening

- fee configuration;
- transaction reconciliation;
- reward review;
- seller approval;
- content moderation;
- refunds;
- security review;
- performance optimization;
- policy pages;
- E2E tests;
- pilot seed data.

---

## 29. Future Versions

Future features must be added only after Version 1 behaviour validates them.

### Version 1.1 — Repeat-sales improvements

- lightweight seller mini-catalogue;
- buyer “shop more from this seller” after checkout;
- browser push notifications with permission;
- favourite/reorder link;
- bulk campaign duplication;
- seller dark mode;
- improved repeat-customer insights;
- seller-created coupon codes;
- bundles;
- automated campaign expiry and restock reminders.

### Version 1.2 — Group goals

- seller creates a group sales target;
- buyers share to unlock a genuine benefit;
- benefit can be delivery discount, bonus item or price reduction;
- target and participant count must be real;
- no pooled customer money beyond normal orders;
- clear cancellation rules if goal is not reached.

### Version 2 — Customer ambassador programme

- sellers invite selected repeat buyers as ambassadors;
- ambassador dashboard without cash wallet;
- tiered seller-specific store credit;
- category/campaign limits;
- fraud controls;
- share performance;
- ambassador badges only within that seller relationship.

### Version 2.1 — Vendor teams

- seller staff accounts;
- roles such as owner, order manager and fulfilment staff;
- branch/pickup location;
- staff audit log;
- assignment of orders.

### Version 2.2 — Better campaign distribution

- reusable campaign templates;
- scheduled campaign activation;
- seller-generated Status packs;
- customer-look galleries;
- waitlist launches;
- preorder countdowns using only true deadlines;
- product request forms.

### Version 3 — Opt-in promoter network

Only after legal, fraud and payment review:

- people may promote products without first buying;
- sellers approve campaigns for promoter access;
- rewards remain non-cash initially;
- promoter quality scoring;
- no public product marketplace unless supply and trust are strong;
- strict anti-spam rules.

### Version 3.1 — Seller-to-seller cross-promotion

- trusted sellers can exchange campaign promotion;
- audience-sharing agreements;
- store-credit or platform-fee rewards;
- no exposure of supplier information;
- seller controls every collaboration.

### Version 4 — Public discovery, only if earned

A public marketplace is not automatically valuable. Add it only when SKWER MKT already has enough active sellers, reliable fulfilment data and buyer demand.

Possible features:

- city/category discovery;
- referral-driven ranking;
- repeat-purchase signals;
- verified completed-order count;
- buyer opt-in following;
- seller collections.

Never rank sellers based only on who pays most.

### Version 5 — Advanced commerce infrastructure

Subject to compliance and demand:

- approved logistics integrations;
- seller custom domains;
- advanced inventory;
- wholesale/preorder modules;
- multi-currency;
- international seller support;
- business registration/KYC integrations;
- accounting exports;
- API/webhooks for larger sellers.

---

## 30. Features Explicitly Deferred

Do not include these in Version 1:

- cash wallet;
- customer cash withdrawals;
- seller loans;
- escrow claims;
- buy-now-pay-later;
- credit scoring;
- public vendor ratings without verified orders;
- open chat system;
- delivery-driver application;
- supplier sourcing network;
- AI product captions;
- AI recommendations;
- live-stream commerce;
- public social feed;
- general-purpose website builder;
- monthly billing;
- native Android/iOS apps;
- cryptocurrency;
- gambling-style referral games.

---

## 31. Product Copy Guide

### Use simple language

Say:

- sales link;
- buyer reward;
- amount you receive;
- customer pays;
- order confirmed;
- share with a friend;
- ready for pickup.

Avoid:

- affiliate attribution;
- GMV;
- conversion funnel;
- omnichannel commerce;
- settlement architecture;
- referral liability;
- merchant acquiring.

### Seller pricing copy

> How much must you receive?

> Your customer will see one final price.

> Your selected buyer reward and secure payment costs are already included.

> You will receive at least ₦10,000 after a successful transaction, subject to the verified payment setup shown here.

### Buyer trust copy

> Secure payment powered by Paystack.

> No account required.

> Your order is recorded immediately after verified payment.

### Referral copy

> Love your purchase? Share it. When a new customer buys through your link, you earn ₦500 off your next order from this seller.

### Reward conditions copy

> Rewards are store credit, not cash. They become available after the referred order qualifies and can be used once with the same seller before expiry.

---

## 32. Seed Data for Development

Create four seed sellers based on the interviewed categories, using fictional names and contact information.

### Seller A — Makeup

- category: Beauty;
- stock: small quantities;
- variation problem: colour/shade;
- payment mode: deposit;
- fulfilment: pickup/personal delivery/meet-up.

### Seller B — Clothing

- category: Fashion;
- stock: small quantity;
- restock: every two weeks;
- payment mode: deposit;
- fulfilment: pickup.

### Seller C — Household items

- category: Home;
- payment mode: full payment before sourcing;
- fulfilment: pickup, delivery, dispatch and waybill;
- key need: sales record and delivery status.

### Seller D — Clothing

- category: Fashion;
- stock: limited;
- frequent two-customer stock conflict;
- fulfilment: dispatch;
- key need: product link, awareness, orders and profit.

Seed:

- at least two campaigns per seller;
- direct order;
- referred order;
- pending reward;
- available reward;
- deposit order;
- outstanding balance;
- sold-out variation;
- restock interest;
- substitution offer;
- refunded order.

---

## 33. Definition of Done for the AI Implementation Agent

An AI implementation agent must not claim Version 1 is complete merely because pages exist.

It must provide:

1. Working Next.js application.
2. Supabase migrations.
3. RLS policies.
4. Seed data.
5. Environment example file.
6. Local setup instructions.
7. Paystack test integration.
8. Verified webhook signature handling.
9. Idempotent payment processing.
10. Server-authoritative pricing.
11. Dynamic product Open Graph previews.
12. Seller campaign creation.
13. Guest buyer checkout.
14. Order status link.
15. Referral attribution.
16. Reward qualification and redemption.
17. Order dashboard.
18. Restock requests.
19. Reports.
20. Admin fee settings.
21. Unit, integration and E2E tests.
22. Privacy/terms/refund placeholders clearly marked for legal review.
23. Responsive mobile design.
24. Accessibility checks.
25. Deployment instructions.
26. No secrets committed.
27. No fake production claims.

Every unfinished feature must be clearly documented as incomplete.

---

## 34. Local Development

Expected commands:

```bash
npm install
cp .env.example .env.local
supabase start
supabase db reset
npm run dev
```

Recommended scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:reset": "supabase db reset",
    "db:types": "supabase gen types typescript --local > src/types/database.ts"
  }
}
```

Before the first production deployment:

- run lint;
- run typecheck;
- run unit/integration tests;
- run E2E tests in Paystack test mode;
- inspect client bundle for secrets;
- review RLS;
- review payment amounts in kobo;
- verify webhook endpoint;
- confirm domain and callback URLs;
- confirm Paystack business approval;
- confirm privacy and seller terms.

---

## 35. Product Decision Rules

When considering any new feature, ask:

1. Does it help a WhatsApp seller get or complete more sales?
2. Does it remove a repeated seller stress?
3. Does it improve buyer trust or speed?
4. Does it strengthen the buyer-to-buyer distribution loop?
5. Can it work without forcing a new habit before value appears?
6. Can it be explained in one sentence?
7. Does it introduce licensing, custody, fraud or operational risk?
8. Can it wait until real pilot evidence supports it?

Reject features that primarily make the dashboard look impressive.

---

## 36. Final Product Vision

SKWER MKT should become the default transaction and growth layer behind Nigerian WhatsApp commerce.

The seller should think:

> I post and chat on WhatsApp, but I use SKWER MKT whenever somebody is ready to buy because it confirms payment, records the order, tracks the customer and can bring me another buyer.

The buyer should think:

> I can buy without stress, track my order and benefit when my recommendation creates a real sale.

The platform should grow because every successful order creates:

- a buyer order link;
- a seller record;
- a shareable referral link;
- a chance for a new buyer;
- a reason for the seller to use SKWER MKT again.

That is the Version 1 thesis. It must be validated with real transactions from the first four vendors before expanding into a larger platform.

---

## 37. Official Technical and Compliance References

- Paystack Split Payments: https://paystack.com/docs/payments/split-payments/
- Paystack Verify Payments: https://paystack.com/docs/payments/verify-payments/
- Paystack Transaction Pricing: https://support.paystack.com/en/articles/2130306
- Paystack Business Types and Starter Limits: https://support.paystack.com/en/articles/2128898
- Paystack Nigeria Compliance Requirements: https://support.paystack.com/en/articles/2123970
- Nigeria Data Protection Act 2023: https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf

These references must be rechecked before production launch because provider requirements, fees and laws can change.

Also in terms of email sending do not use supabase or any other, I already have my node mailer separately hosted email server on vercel https://send-email-three-lake.vercel.app/ and here is it's complete source code so you understand how it works and how you use it 
```js
const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { to, subject, html, text, secret } = req.body;

  // Block unauthorized use
  const expectedSecret = process.env.EMAIL_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "to, subject, html are required" });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "465");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromName = process.env.FROM_NAME  || "Surer";
  const fromEmail= process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error("[email-server] SMTP credentials not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host:   smtpHost,
      port:   smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // needed for some shared hosting SMTP servers
      },
    });

    await transporter.sendMail({
      from:    `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
    });

    console.log(`[email-server] Sent to ${to}: ${subject}`);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("[email-server] Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
```

*A seller is not limited to just a product to sales link (campaign), they can add more different product, making stress free for them to create and share so many links to customers, so a link could have 3 different product where the customer can choose the one they want and pay, same process, but note that each product has their own reward, own price, media, name and so on, if a custumer pays for 2 product in a link of 4, when he shares the link and a new customer pays something from that link, he gets the reward for the two product he payed, so its still same thing as before, and ensure the process of add product or products for a campaign is simple and easy for vendors i mean very easy and fast for them, else they will get tired*

