const faq = [
  ["Who is this for?", "HighRiskIntel is aimed at high-risk merchants, payment facilitators, and partners who need oversight beyond a standard PSP dashboard."],
  ["Do merchants need API access?", "No. They can connect a processor directly or upload previous months of processing and bank statements during onboarding."],
  ["What happens after signup?", "The merchant completes a business survey, chooses how to share payment data, and then lands in a monitored dashboard while analysis completes."],
  ["Can this be white-labeled?", "Yes. The platform structure is built to support managed-service workflows and partner-facing positioning."]
];

export function FAQ() {
  return (
    <section className="rounded-[2rem] shell-border p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Questions operators usually ask</h2>
      <div className="mt-6 grid gap-5">
        {faq.map(([question, answer]) => (
          <div key={question} className="border-b border-slate-800 pb-5 last:border-b-0 last:pb-0">
            <p className="text-sm font-semibold text-slate-100">{question}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
