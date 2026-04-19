import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D1D5DB] bg-[#F7F7F8]">
        <span className="text-sm font-semibold text-[#1E2A38]">HR</span>
      </div>
      <div>
        <div className="text-base font-semibold tracking-tight text-[#111111]">HighRiskIntel</div>
        <p className="text-xs text-[#6B7280]">Merchant risk operations</p>
      </div>
    </Link>
  );
}
