import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "$250",
    period: "/mo",
    desc: "For merchants under $50k/mo getting started with risk management.",
    features: [
      "Up to $50k monthly volume",
      "AI risk scoring on all transactions",
      "EDR alerts via Chargebacks911",
      "Dispute ratio monitoring",
      "Weekly branded reports",
      "Dispute reason code analysis",
      "Email support"
    ],
    cta: "Get started",
    highlight: false
  },
  {
    name: "Professional",
    price: "$600",
    period: "/mo",
    desc: "Full intelligence suite for established high-risk merchants.",
    features: [
      "Up to $500k monthly volume",
      "Everything in Starter",
      "12hr human review cycle",
      "MID termination prediction",
      "Rolling reserve forecasting",
      "Authorization health monitoring",
      "Automation rules builder",
      "Priority support + analyst access"
    ],
    cta: "Get started",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For high-volume merchants, ISOs, and payment facilitators.",
    features: [
      "Unlimited volume",
      "Everything in Professional",
      "Dedicated risk analyst",
      "Custom API integrations",
      "SLA guarantee",
      "White-glove onboarding",
      "Direct acquirer relationships"
    ],
    cta: "Contact sales",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>HighRiskIntel</Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Product", "/product"], ["Pricing", "/pricing"], ["Security", "/security"], ["Docs", "/docs"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 14, color: "#8C8C9A" }}>{l}</Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/signin" style={{ fontSize: 14, color: "#8C8C9A", padding: "8px 16px" }}>Sign in</Link>
            <Link href="/signup" style={{ background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "9px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 60px", textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 16, display: "block" }}>Pricing</span>
        <h1 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 52, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 20 }}>
          Simple, transparent pricing.
        </h1>
        <p style={{ fontSize: 17, color: "#8C8C9A", lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
          No setup fees. No hidden charges. Cancel anytime. Plus a 10% performance fee only on disputes we prevent.
        </p>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? "linear-gradient(180deg,rgba(30,50,100,0.5) 0%,rgba(15,20,40,0.5) 100%)" : "#111118",
                border: plan.highlight ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#3B82F6,#818CF8)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "5px 18px", borderRadius: 100 }}>
                  Most Popular
                </div>
              )}
              <p style={{ fontSize: 11, fontWeight: 600, color: "#55555F", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 14 }}>{plan.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 48, fontWeight: 900, color: "#F1F1F3", letterSpacing: "-2px" }}>{plan.price}</span>
                <span style={{ color: "#55555F", fontSize: 14 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: "#8C8C9A", marginBottom: 28, lineHeight: 1.7 }}>{plan.desc}</p>
              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: 24 }} />
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginBottom: 28 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: "#8C8C9A", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Enterprise" ? "mailto:sales@highriskintel.com" : "/signup"}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "13px",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  background: plan.highlight ? "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)" : "transparent",
                  color: plan.highlight ? "#fff" : "#F1F1F3",
                  border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)"
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Performance fee */}
        <div style={{ marginTop: 32, background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.14)", borderRadius: 14, padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: 20 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#F1F1F3", marginBottom: 8 }}>10% Performance Fee on Prevented Disputes</p>
            <p style={{ fontSize: 13, color: "#8C8C9A", lineHeight: 1.75 }}>
              On top of your monthly plan, we charge 10% of the dollar value of disputes we actively prevent through EDR network alerts and auto-refund actions. No prevention means no fee — our incentives are aligned with yours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
