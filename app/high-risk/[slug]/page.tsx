import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HIGH_RISK_SEO_PAGES, getHighRiskSeoPage, getRelatedHighRiskSeoPages } from "@/lib/high-risk-seo";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

type HighRiskPageProps = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return HIGH_RISK_SEO_PAGES.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: HighRiskPageProps): Metadata {
  const page = getHighRiskSeoPage(params.slug);

  if (!page) {
    return {};
  }

  const url = absoluteUrl(`/high-risk/${page.slug}`);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function HighRiskSeoPage({ params }: HighRiskPageProps) {
  const page = getHighRiskSeoPage(params.slug);

  if (!page) {
    notFound();
  }

  const relatedPages = getRelatedHighRiskSeoPages(page);
  const operatingChecklist = [
    `Pull the last 90 days of disputes, refunds, payout changes, and support notes for ${page.vertical.label.toLowerCase()}.`,
    `Separate preventable disputes from unavoidable disputes so the team can fix the controllable ${page.topic.primaryRisk} signals first.`,
    "Match customer receipts, descriptors, support macros, shipping notices, and refund language against what cardholders actually see.",
    "Document the remediation owner, due date, expected metric movement, and evidence that can be shared if a processor asks.",
  ];
  const auditQuestions = [
    `Did ${page.vertical.label.toLowerCase()} see a recent traffic-source, offer, pricing, fulfillment, or support change?`,
    "Are not-recognized, product-not-received, canceled-recurring, or not-as-described disputes increasing?",
    "Is the merchant relying on processor emails after the fact, or watching account pressure weekly?",
    "Can the team prove what changed after a spike, reserve notice, gateway issue, or payout delay?",
  ];
  const faqs = [
    {
      question: `Why are ${page.vertical.label.toLowerCase()} considered higher risk?`,
      answer: `Processors usually care less about the label by itself and more about patterns: ${page.vertical.riskDrivers.join(", ")}, refund pressure, support responsiveness, and whether the merchant can explain changes clearly.`,
    },
    {
      question: `What should be checked first for ${page.topic.label}?`,
      answer: `Start with the recent chargeback ratio, refund rate, payout timing, dispute reason codes, descriptor clarity, customer-service delays, and any processor or gateway notices from the last 30 to 90 days.`,
    },
    {
      question: "Can HighRiskIntel help with this before an account is shut down?",
      answer: "Yes. The goal is to organize the risk story early: what changed, which metrics are moving, what fixes are underway, and what evidence is ready if the processor requests a remediation plan.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "FAQPage"],
    name: page.title,
    description: page.description,
    url: absoluteUrl(`/high-risk/${page.slug}`),
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    about: {
      "@type": "Service",
      name: `HighRiskIntel risk audit for ${page.vertical.label.toLowerCase()}`,
      serviceType: "Merchant risk monitoring and chargeback prevention",
      audience: page.vertical.audience,
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `HighRiskIntel risk audit for ${page.vertical.label.toLowerCase()}`,
    serviceType: "Merchant risk monitoring and chargeback prevention",
    provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl() },
    mainEntity: {
      "@type": "Audience",
      audienceType: page.vertical.audience,
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#111111]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5D9DF] bg-[#F7F7F8] text-sm font-semibold text-[#1E2A38]">
              HR
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">HighRiskIntel</div>
              <div className="text-xs text-[#6B7280]">Merchant risk operations</div>
            </div>
          </Link>
          <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-4 py-2.5 text-sm font-medium text-white">
            Free risk audit
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                {page.vertical.label} / {page.topic.label}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">{page.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#6B7280]">
                HighRiskIntel helps {page.vertical.audience} spot {page.topic.primaryRisk}, dispute pressure, refund issues, payout changes, and processor-review signals before they become expensive account problems.
              </p>
              <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
                {["90-day review", "Processor-ready notes", "Audit-first workflow"].map((item) => (
                  <div key={item} className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3 text-sm font-medium text-[#1E2A38]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/risk-audit" className="rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-medium text-white">
                  Request free audit
                </Link>
                <Link href="/tools/chargeback-rate-calculator" className="rounded-xl border border-[#D5D9DF] bg-white px-5 py-3 text-sm font-medium">
                  Calculate chargeback rate
                </Link>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#E5E7EB] bg-[#F7F7F8] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Audit focus</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-[#111111]">What gets reviewed first</p>
              <div className="mt-5 space-y-3">
                {page.topic.auditFocus.map((item) => (
                  <div key={item} className="rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm capitalize leading-6">
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Operator view</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">This is the risk story a processor wants to understand.</h2>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                When {page.vertical.label.toLowerCase()} search for {page.topic.label}, the real problem is usually not one isolated dispute. It is a pattern across sales source, customer expectation, fulfillment evidence, refund timing, and processor communication.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-sm font-semibold text-[#111111]">Commercial intent</p>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">{page.vertical.intent} who need to {page.topic.searchIntent}.</p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-sm font-semibold text-[#111111]">Primary risk</p>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">
                    The page is built around {page.topic.primaryRisk}, but the audit also checks the surrounding signals that make the account look unstable.
                  </p>
                </div>
              </div>
            </div>
            <aside className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Fast triage</p>
              <div className="mt-5 space-y-4">
                {["Account pressure", "Customer confusion", "Evidence gaps"].map((label, index) => (
                  <div key={label} className="flex gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D5D9DF] bg-[#F7F7F8] text-xs font-semibold text-[#1E2A38]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#6B7280]">Check whether this is increasing, documented, and assigned to someone.</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB]">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Why this category gets reviewed</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Risk teams look for patterns, not excuses.</h2>
            </div>
            <div className="grid gap-4 lg:col-span-2">
              {page.vertical.riskDrivers.map((driver) => (
                <div key={driver} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="text-sm font-semibold capitalize text-[#111111]">{driver}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">
                    For {page.vertical.label.toLowerCase()}, this can create account-review pressure when it appears alongside refund delays, unclear customer communication, weak fulfillment proof, or a rising dispute ratio.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Checklist</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">What a serious remediation file should include.</h2>
              <div className="mt-8 space-y-3">
                {operatingChecklist.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5 text-sm leading-7 text-[#111111]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Questions</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">The audit starts with the facts that change risk quickly.</h2>
              <div className="mt-8 space-y-3">
                {auditQuestions.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5 text-sm leading-7 text-[#111111]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">What to monitor</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                A clean risk story is easier to defend when the numbers are already organized.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                Merchants searching for {page.topic.label} usually need a simple operating view: chargeback rate, refund rate, transaction movement, customer-service notes, descriptor clarity, and evidence of corrective action.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {["Chargeback ratio", "Refund pressure", "Processor notices", "Remediation notes"].map((metric) => (
                <div key={metric} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
                  <p className="text-sm font-semibold">{metric}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">Track this weekly so the first warning does not come from the processor.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">FAQ</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Questions merchants ask before contacting risk support.</h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <h3 className="text-sm font-semibold leading-6 text-[#111111]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Related pages</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">More risk pages for {page.vertical.label.toLowerCase()}.</h2>
              </div>
              <Link href="/high-risk" className="text-sm font-medium text-[#1E2A38]">
                View directory
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relatedPages.map((related) => (
                <Link key={related.slug} href={`/high-risk/${related.slug}`} className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5 transition hover:border-[#D5D9DF]">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{related.topic.label}</p>
                  <h3 className="mt-3 text-sm font-semibold leading-6 text-[#111111]">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F7F8]">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">Next step</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Get a free risk audit for this merchant category.</h2>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                The audit is built to identify preventable chargeback, reserve, and processor-review risks. It is not a workaround for rules or compliance requirements; it is a practical way to see what needs fixing first.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6">
              <p className="text-lg font-semibold">Free HighRiskIntel audit</p>
              <p className="mt-3 text-sm leading-7 text-[#6B7280]">Send the account context and we will route the visitor into the lead form.</p>
              <Link href="/risk-audit" className="mt-6 inline-flex w-full justify-center rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-medium text-white">
                Start free audit
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
