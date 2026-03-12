const features = [
  {
    title: "Merchant intake that actually qualifies risk",
    body: "Collect business model, fulfillment, approval history, reserves, chargebacks, and processing patterns before you ever trust the data."
  },
  {
    title: "Connect APIs or upload prior statements",
    body: "Support live processor connections or guided upload flows for previous months of statements and banking evidence."
  },
  {
    title: "MID health and termination pressure tracking",
    body: "Watch chargeback velocity, reserve strain, approval pressure, and processor thresholds before they become shutdown events."
  },
  {
    title: "Executive reporting for operators and partners",
    body: "Turn raw transaction risk into weekly merchant summaries, alert feeds, and actions teams can actually follow."
  }
];

export function Features() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-[1.75rem] shell-border p-6">
          <p className="text-sm font-semibold tracking-tight text-white">{feature.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{feature.body}</p>
        </article>
      ))}
    </section>
  );
}
