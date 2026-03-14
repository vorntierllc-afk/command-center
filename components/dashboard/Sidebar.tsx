import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: "▪" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "◈" },
  { label: "Transactions", href: "/dashboard/transactions", icon: "⬡" },
  { label: "Risk", href: "/dashboard/risk", icon: "⬟" },
  { label: "Alerts", href: "/dashboard/alerts", icon: "◇" },
  { label: "Reports", href: "/dashboard/reports", icon: "◆" },
  { label: "Settings", href: "/dashboard/settings", icon: "⬠" }
];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex h-full flex-col rounded-[2rem] shell-border p-4">
      <Logo />
      <div className="mt-8 space-y-1">
        {links.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition-colors",
              active === href && "bg-amber-300/10 text-amber-100 ring-1 ring-amber-300/30"
            )}
          >
            <span className="text-xs opacity-60">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
