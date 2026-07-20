export function chooseAttribution(input: {
  existing: { code: string; expiresAt: Date } | null;
  incoming: { code: string; expiresAt: Date } | null;
  checkoutStarted: boolean;
  explicitlyRemoved: boolean;
}) {
  if (input.checkoutStarted) return input.existing;
  if (input.explicitlyRemoved) return null;
  if (input.incoming && input.incoming.expiresAt > new Date())
    return input.incoming;
  if (input.existing && input.existing.expiresAt > new Date())
    return input.existing;
  return null;
}
