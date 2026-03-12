const plans = [
  {
    name: "Starter",
    price: "$799/mo",
    description: "For merchants who need onboarding, statement review, and baseline monitoring.",
    cta: "Start intake"
  },
  {
    name: "Growth",
    price: "$1,950/mo",
    description: "For operators with live processor connectivity, alerting, and ongoing weekly reporting.",
    cta: "Talk to sales"
  },
  {
    name: "Managed",
    price: "Custom",
    description: "For enterprise portfolios, multi-MID oversight, and white-label managed intelligence.",
    cta: "Book consult"
  }
];

export function Pricing() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className="rounded-[1.75rem] shell-border p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{plan.name}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{plan.price}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
          <button className="mt-6 rounded-full border border-amber-300/40 px-4 py-2 text-sm font-semibold text-amber-100 hover:border-amber-200 hover:text-white">
            {plan.cta}
          </button>
        </article>
      ))}
    </section>
  );
}
