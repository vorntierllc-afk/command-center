import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — API Reference, Integrations & Getting Started Guide",
  description:
    "HighRiskIntel documentation: getting started guide, API reference for risk scoring, processor integrations (Stripe, Checkout.com, Adyen, MXMerchant), dashboard guides, and alert configuration.",
  alternates: { canonical: "https://highriskintel.com/docs" },
  openGraph: {
    url: "https://highriskintel.com/docs",
    title: "HighRiskIntel Docs — API Reference & Integration Guides",
    description:
      "Everything you need to integrate and use HighRiskIntel. Transaction risk score API, processor connections, alert configuration."
  }
};

const SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { title: "Quick Start", desc: "Connect your processor and start monitoring in under 10 minutes." },
      { title: "Account Setup", desc: "Create your account, complete merchant intake, and configure risk settings." },
      { title: "Processor Connection", desc: "Supported processors: Stripe, Checkout.com, Adyen, MXMerchant, Authorize.net." }
    ]
  },
  {
    title: "Dashboard",
    items: [
      { title: "Risk Score", desc: "How the 0–100 merchant risk score is calculated and what it means." },
      { title: "Authorization Health", desc: "Understanding approval rates, decline rates, and baseline deviation." },
      { title: "Chargeback Exposure", desc: "Dispute ratio monitoring, thresholds, and mitigation actions." },
      { title: "Volume Behavior", desc: "Daily volume tracking, spike detection, and cross-border analysis." }
    ]
  },
  {
    title: "Alerts",
    items: [
      { title: "Alert Types", desc: "Chargeback spikes, auth drops, volume anomalies, refund latency." },
      { title: "Severity Levels", desc: "Critical, Warning, Low — when each fires and what to do." },
      { title: "Mitigation Actions", desc: "Recommended response actions for each alert type." },
      { title: "Notification Settings", desc: "Configure email and SMS alerts in Settings." }
    ]
  },
  {
    title: "Risk Engine",
    items: [
      { title: "Scoring Formula", desc: "Dispute ratio (40pts) + Auth deviation (20pts) + Volume spike (15pts) + Refund ratio (15pts) + Cross-border (10pts)." },
      { title: "Transaction Scoring", desc: "Per-transaction 0–100 risk scoring using BIN, country, velocity, email, and amount signals." },
      { title: "Status Thresholds", desc: "Stable: 0–40. Elevated: 41–70. Critical: 71–100." }
    ]
  },
  {
    title: "Integrations",
    items: [
      { title: "Stripe", desc: "Full live integration — transactions, disputes, payouts." },
      { title: "Checkout.com", desc: "Webhook-based event streaming." },
      { title: "Adyen", desc: "Authorization and dispute event integration." },
      { title: "MXMerchant", desc: "High-risk processor connectivity." },
      { title: "Authorize.net", desc: "ARB and transaction-level sync." }
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "POST /api/risk-score", desc: "Score an individual transaction. Rate limited to 100 req/min." },
      { title: "GET /api/dashboard/overview", desc: "Returns full merchant risk overview including score, alerts, and metrics." },
      { title: "GET /api/alerts", desc: "Returns merchant alert feed." },
      { title: "GET /api/transactions", desc: "Paginated transaction list with risk filter support." }
    ]
  }
];

export default function DocsPage() {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>HighRiskIntel</Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Product", "/product"], ["Pricing", "/pricing"], ["Security", "/security"], ["Docs", "/docs"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 14, color: l === "Docs" ? "#F1F1F3" : "#8C8C9A" }}>{l}</Link>
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
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 60px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 16, display: "block" }}>Documentation</span>
        <h1 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 52, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 20 }}>
          Everything you need to get started.
        </h1>
        <p style={{ fontSize: 16, color: "#8C8C9A", lineHeight: 1.8, maxWidth: 500 }}>
          Guides, API reference, and integration documentation for HighRiskIntel.
        </p>
      </section>

      {/* Docs grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 32 }}>
          {SECTIONS.map(section => (
            <div key={section.title}>
              <h2 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.3px" }}>{section.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {section.items.map(item => (
                  <div
                    key={item.title}
                    style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", cursor: "pointer", transition: "border-color 0.15s" }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F1F1F3", marginBottom: 5 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: "#55555F", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API highlight */}
        <div style={{ marginTop: 48, background: "#0C0C10", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "44px 40px" }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 14, display: "block" }}>API Reference</span>
              <h3 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 16 }}>Transaction Risk Score API</h3>
              <p style={{ fontSize: 13, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 20 }}>
                Score any transaction in real-time. Returns a 0–100 risk score with signals and a recommended action (approve / review / block).
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Rate limited: 100 req/min", "Returns: score, action, signals", "Sub-100ms response", "No PAN required"].map(f => (
                  <li key={f} style={{ fontSize: 12, color: "#55555F", display: "flex", gap: 8 }}>
                    <span style={{ color: "#22C55E" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#07070A", borderLeft: "1px solid rgba(255,255,255,0.07)", padding: "24px" }}>
              <div style={{ background: "#0C0C10", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "10px 16px", fontSize: 11, color: "#55555F", marginBottom: 0, display: "flex", gap: 8 }}>
                <span style={{ color: "#22C55E" }}>POST</span>
                <span>/api/risk-score</span>
              </div>
              <pre style={{ padding: "20px", fontSize: 11, color: "#8C8C9A", lineHeight: 1.9, margin: 0, overflow: "auto" }}>{`{
  "amount": 349.00,
  "country": "NG",
  "cardBin": "523456",
  "email": "user@tempmail.com",
  "ipVelocityCount": 2,
  "binVelocityCount": 1
}

// Response
{
  "riskScore": 91,
  "action": "block",
  "reason": "Risk exceeds threshold.",
  "signals": {
    "country_risk": 24,
    "bin_risk": 15,
    "email_risk": 10,
    "amount_risk": 12
  }
}`}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
