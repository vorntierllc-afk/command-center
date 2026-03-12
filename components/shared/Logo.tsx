import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/50">
        <span className="text-sm font-semibold text-amber-200">HR</span>
      </div>
      <div>
        <div className="text-lg font-semibold tracking-tight text-white">
          HighRisk<span className="text-amber-300">Intel</span>
        </div>
        <p className="text-xs text-slate-400">Managed merchant risk intelligence</p>
      </div>
    </Link>
  );
}
