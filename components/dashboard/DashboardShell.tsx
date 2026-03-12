import { Sidebar } from "@/components/dashboard/Sidebar";

export function DashboardShell({
  active,
  title,
  description,
  children
}: {
  active: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar active={active} />
      <section className="space-y-6">
        <header className="rounded-[1.75rem] shell-border px-6 py-5">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </header>
        {children}
      </section>
    </main>
  );
}
