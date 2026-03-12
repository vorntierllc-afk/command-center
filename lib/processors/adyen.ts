export async function validateAdyenConnection(apiKey: string, merchantAccount: string) {
  const response = await fetch("https://checkout-test.adyen.com/pal/servlet/Payment/v68/getAuthenticationResult", {
    method: "POST",
    headers: {
      "x-API-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ merchantAccount, recurring: {} })
  });
  if (!response.ok) {
    throw new Error("Adyen credentials failed validation.");
  }
  return { valid: true };
}
