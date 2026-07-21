import { createClient } from "@/lib/supabase/server";
import { BusinessSettingsForm } from "@/components/seller/business-settings-form";
import { ShareAction } from "@/components/shared/share-actions";
import { PaymentOnboardingForm } from "@/components/seller/payment-onboarding-form";

export default async function Page() {
  const db = await createClient();
  const [{ data: business }, { data: payment }] = await Promise.all([
    db
      .from("seller_businesses")
      .select(
        "business_name,slug,whatsapp_phone,city,state,short_description,pickup_note,delivery_note,return_policy",
      )
      .maybeSingle(),
    db
      .from("seller_payment_accounts")
      .select(
        "bank_code,account_number_last4,account_name,provider_verified,status",
      )
      .maybeSingle(),
  ]);
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>Business settings</h1>
          <p>Keep the information buyers rely on accurate.</p>
        </div>
        {business && (
          <ShareAction
            url={`/s/${business.slug}`}
            title={`Products from ${business.business_name}`}
            text={`Choose and order from ${business.business_name}.`}
            label="Share multi-product link"
          />
        )}
      </header>
      <div className="settings-grid">
        {business ? (
          <BusinessSettingsForm business={business} />
        ) : (
          <section className="panel empty-state">
            <h2>Complete business setup first</h2>
            <p>Your public seller identity is created during onboarding.</p>
            <a className="button button-small" href="/seller/onboarding">
              Start setup
            </a>
          </section>
        )}
        <section className="panel form-stack">
          <h2>Payment account</h2>
          {payment ? (
            <>
              <div className="notice">
                {payment.provider_verified
                  ? "Your Paystack settlement account is verified."
                  : "Your payment account is awaiting verification. Live seller settlement remains disabled until approval."}
              </div>
              <p>
                <strong>
                  {payment.account_name || "Account name pending"}
                </strong>
              </p>
              <p>Account ending {payment.account_number_last4 || "—"}</p>
              <p>
                Status: <span className="badge">{payment.status}</span>
              </p>
            </>
          ) : (
            <PaymentOnboardingForm />
          )}
        </section>
      </div>
    </>
  );
}
