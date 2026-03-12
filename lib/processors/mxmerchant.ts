export async function validateMxMerchantConnection(apiKey: string) {
  if (!apiKey) {
    throw new Error("MXMerchant API key is required.");
  }
  return { valid: true };
}
