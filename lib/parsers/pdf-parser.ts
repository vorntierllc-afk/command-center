import pdf from "pdf-parse";
import type { TransactionInput } from "@/lib/server/types";

const amountRegex = /\$?([0-9,]+\.\d{2})/g;
const dateRegex = /\b(\d{2}\/\d{2}\/\d{4})\b/g;

export async function parsePdfStatement(buffer: Buffer): Promise<TransactionInput[]> {
  const result = await pdf(buffer);
  const text = result.text;
  const amounts = [...text.matchAll(amountRegex)].map((match) => Number(match[1].replace(/,/g, "")));
  const dates = [...text.matchAll(dateRegex)].map((match) => new Date(match[1]));

  return amounts.slice(0, Math.max(1, Math.min(amounts.length, 25))).map((amount, index) => ({
    txId: `pdf-${index + 1}`,
    amount,
    status: /chargeback|dispute/i.test(text) ? "review" : "approved",
    cardBin: "411111",
    country: "US",
    createdAt: dates[index] || new Date()
  }));
}
