export const metadata = { title: "Reset password" };
export default function Page() {
  return (
    <>
      <span className="eyebrow">Account recovery</span>
      <h1>Reset your password</h1>
      <p>
        Enter your seller email. We will send a secure recovery link when email
        service configuration is active.
      </p>
      <form className="form-stack">
        <label>
          Email address
          <input type="email" required />
        </label>
        <button className="button">Send recovery link</button>
      </form>
    </>
  );
}
