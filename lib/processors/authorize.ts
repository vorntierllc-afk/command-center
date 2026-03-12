export async function validateAuthorizeConnection(apiLoginId: string, transactionKey: string) {
  if (!apiLoginId || !transactionKey) {
    throw new Error("Authorize.net credentials are required.");
  }
  return { valid: true };
}
