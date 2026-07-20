import { createHash, randomInt, timingSafeEqual } from "node:crypto";
export function createOtp() {
  return randomInt(100000, 1000000).toString();
}
export function hashOtp(email: string, code: string, secret: string) {
  return createHash("sha256")
    .update(`${email.toLowerCase()}:${code}:${secret}`)
    .digest("hex");
}
export function otpMatches(
  email: string,
  code: string,
  secret: string,
  hash: string,
) {
  const a = Buffer.from(hashOtp(email, code, secret), "hex"),
    b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
