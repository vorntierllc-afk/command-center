interface AlertRow {
  id: string;
  type: string;
  message: string;
}

export function Alerts({ alerts }: { alerts: AlertRow[] }) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="rounded-[1.5rem] shell-border p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{alert.type}</p>
          <p className="mt-2 text-sm text-white">{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
