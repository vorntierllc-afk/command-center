import Papa from "papaparse";
import type { TransactionInput } from "@/lib/server/types";

const HEADER_MAP: Record<string, keyof TransactionInput | "createdAt"> = {
  date: "createdAt",
  transaction_date: "createdAt",
  amount: "amount",
  total: "amount",
  status: "status",
  card: "cardBin",
  card_number: "cardBin",
  bin: "cardBin",
  country: "country",
  email: "email",
  tx_id: "txId"
};

export function parseCsvStatement(content: string): TransactionInput[] {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data.map((row, index) => {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[key.toLowerCase()] = value;
    }

    return {
      txId: normalized.tx_id || normalized.id || `csv-${index + 1}`,
      amount: Number(normalized.amount || normalized.total || 0),
      status: normalized.status || "approved",
      cardBin: normalized.card || normalized.card_number || normalized.bin || "",
      country: normalized.country || "US",
      email: normalized.email || undefined,
      createdAt: normalized.date ? new Date(normalized.date) : new Date()
    };
  });
}
