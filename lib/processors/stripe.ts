import Stripe from "stripe";

export async function validateStripeConnection(secretKey: string) {
  const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });
  const account = await stripe.accounts.retrieve();
  return { valid: true, accountId: account.id };
}

export async function syncStripeTransactions(secretKey: string) {
  const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });
  const charges = await stripe.charges.list({ limit: 25, created: { gte: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60 } });
  return charges.data.map((charge) => ({
    txId: charge.id,
    amount: charge.amount / 100,
    currency: charge.currency.toUpperCase(),
    country: charge.billing_details.address?.country || "US",
    cardBin: charge.payment_method_details?.card?.last4 || "",
    status: charge.status,
    email: charge.billing_details.email || undefined,
    createdAt: new Date(charge.created * 1000)
  }));
}
