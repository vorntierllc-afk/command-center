export function StepChoose() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[1.5rem] shell-border p-5">
        <h3 className="text-lg font-semibold text-white">Connect processor API</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Get live data instantly by validating API credentials for Stripe, Checkout.com, Adyen, MXMerchant, or Authorize.net.</p>
      </div>
      <div className="rounded-[1.5rem] shell-border p-5">
        <h3 className="text-lg font-semibold text-white">Upload prior statements</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Upload 2-3 months of processing and banking statements for parsing while underwriting intake is completed.</p>
      </div>
    </div>
  );
}
