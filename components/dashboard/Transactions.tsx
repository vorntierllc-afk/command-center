interface TransactionRow {
  id: string;
  txId: string;
  amount: number;
  riskScore: number;
  status: string;
  country?: string | null;
}

export function Transactions({ transactions }: { transactions: TransactionRow[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] shell-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-slate-400">
          <tr>
            <th className="px-4 py-3">TX ID</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Country</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-slate-800 text-slate-200">
              <td className="px-4 py-3">{tx.txId}</td>
              <td className="px-4 py-3">${tx.amount.toFixed(2)}</td>
              <td className="px-4 py-3">{tx.riskScore}</td>
              <td className="px-4 py-3">{tx.status}</td>
              <td className="px-4 py-3">{tx.country || "US"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
