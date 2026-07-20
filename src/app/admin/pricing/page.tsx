import { formatNaira } from "@/lib/money";
export default function Page() {
  return (
    <>
      <header className="app-topbar">
        <div>
          <h1>Pricing configuration</h1>
          <p>Versioned rules apply only to future campaigns and orders.</p>
        </div>
        <button className="button button-small">Create new version</button>
      </header>
      <div className="settings-grid">
        <form className="panel form-stack">
          <h2>Active NGN configuration</h2>
          <label>
            Paystack percentage (basis points)
            <input type="number" defaultValue="150" />
          </label>
          <label>
            Fixed amount (kobo)
            <input type="number" defaultValue="10000" />
          </label>
          <label>
            Fixed-fee threshold (kobo)
            <input type="number" defaultValue="250000" />
          </label>
          <label>
            Fee cap (kobo)
            <input type="number" defaultValue="200000" />
          </label>
          <label>
            Platform percentage (basis points)
            <input type="number" defaultValue="200" />
          </label>
          <label>
            Rounding increment (kobo)
            <input type="number" defaultValue="5000" />
          </label>
          <button className="button">Validate and schedule</button>
        </form>
        <section className="panel">
          <h2>Common price preview</h2>
          <div className="order-summary">
            <p>
              <span>Seller receives {formatNaira(500000)}</span>
              <strong>Buyer sees {formatNaira(565000)}</strong>
            </p>
            <p>
              <span>Seller receives {formatNaira(1000000)}</span>
              <strong>Buyer sees {formatNaira(1100000)}</strong>
            </p>
            <p>
              <span>Seller receives {formatNaira(2500000)}</span>
              <strong>Buyer sees {formatNaira(2725000)}</strong>
            </p>
          </div>
          <p className="notice">
            Saving creates a new effective-dated configuration. Existing pricing
            snapshots never change.
          </p>
        </section>
      </div>
    </>
  );
}
