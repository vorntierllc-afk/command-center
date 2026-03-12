export async function validateCheckoutConnection(secretKey: string) {
  const response = await fetch("https://api.checkout.com/reporting/statements", {
    headers: { Authorization: secretKey }
  });
  if (!response.ok) {
    throw new Error("Checkout.com credentials failed validation.");
  }
  return { valid: true };
}
