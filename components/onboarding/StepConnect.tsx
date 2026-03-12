export const PROCESSOR_FIELDS: Record<string, string[]> = {
  stripe: ["Secret Key", "Publishable Key"],
  checkout: ["Secret Key", "Processing Channel ID"],
  adyen: ["API Key", "Merchant Account", "Client Key"],
  mxmerchant: ["API Key", "Merchant ID"],
  authorize: ["API Login ID", "Transaction Key"]
};

export function StepConnect() {
  return (
    <div className="rounded-[1.5rem] shell-border p-5">
      <h3 className="text-lg font-semibold text-white">Processor connection</h3>
      <p className="mt-2 text-sm text-slate-400">After the intake survey, merchants can connect their processor and we validate credentials before syncing the most recent data window.</p>
    </div>
  );
}
