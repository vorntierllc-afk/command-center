import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const links = [
  ["Overview", "/dashboard"],
  ["Transactions", "/dashboard/transactions"],
  ["Risk", "/dashboard/risk"],
  ["Alerts", "/dashboard/alerts"],
  ["Reports", "/dashboard/reports"],
  ["Settings", "/dashboard/settings"]
];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex h-full flex-col rounded-[2rem] shell-border p-4">
      <Logo />
      <div className="mt-8 space-y-2">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "block rounded-2xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-900 hover:text-white",
              active === href && "bg-amber-300/10 text-amber-100 ring-1 ring-amber-300/30"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
