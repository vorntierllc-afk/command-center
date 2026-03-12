export function StepAnalyzing() {
  return (
    <div className="rounded-[1.5rem] shell-border p-5">
      <h3 className="text-lg font-semibold text-white">Analyzing account</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        <li>Connecting to processor or parsing uploaded statements</li>
        <li>Building the merchant risk profile</li>
        <li>Scoring transaction behavior</li>
        <li>Generating the first dashboard snapshot</li>
      </ul>
    </div>
  );
}
