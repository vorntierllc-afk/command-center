export function RiskMonitor() {
  const rules = [
    "Country exposure weighted against high-risk lists",
    "Prepaid and virtual BIN concentration",
    "Velocity by BIN and IP address",
    "Unusual ticket size and off-hours activity",
    "Disposable email and low-trust buyer patterns"
  ];

  return (
    <div className="rounded-[1.75rem] shell-border p-6">
      <h2 className="text-xl font-semibold text-white">Risk engine focus</h2>
      <div className="mt-5 grid gap-3">
        {rules.map((rule) => (
          <div key={rule} className="rounded-2xl bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}
