import Link from "next/link";

export function StepComplete() {
  return (
    <div className="rounded-[1.5rem] shell-border p-5">
      <h3 className="text-lg font-semibold text-white">Setup complete</h3>
      <p className="mt-2 text-sm text-slate-400">The merchant can now enter the dashboard. If processing is still underway, sample insights remain visible until real data is ready.</p>
      <Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">
        Open dashboard
      </Link>
    </div>
  );
}
