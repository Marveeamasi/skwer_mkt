# Paystack local webhook testing

Paystack signs webhook payloads with the Paystack secret key. This project keeps both `PAYSTACK_SECRET_KEY` and `PAYSTACK_WEBHOOK_SECRET` locally for clarity, but their values are the same; there is no separate webhook secret field in the Paystack dashboard.

## One-time ngrok setup

1. Sign in at ngrok and copy your personal authtoken.
2. From the project root, run:

   ```powershell
   ngrok config add-authtoken YOUR_TOKEN --config .ngrok.yml
   ```

3. Never commit `.ngrok.yml`; it is ignored because it will contain the token.

## Start the app and tunnel

Opening a tunnel exposes the local application to the public internet for as long as ngrok runs. Use test data and stop both processes when finished.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-webhook-tunnel.ps1
```

The script prints a URL similar to:

```text
https://example.ngrok-free.app/api/webhooks/paystack
```

Place that full HTTPS URL in Paystack's webhook URL setting. Set `NEXT_PUBLIC_APP_URL` to the printed base URL while testing callbacks, then restart the app if it was already running.

The webhook handler is `POST /api/webhooks/paystack`. It reads the raw body, verifies `x-paystack-signature` with HMAC SHA-512, rejects invalid signatures, checks amount and currency, and processes repeated event keys idempotently.
