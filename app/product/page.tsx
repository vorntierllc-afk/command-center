import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product — AI Risk Engine, MID Protection & Chargeback Prevention",
  description:
    "Every tool a high-risk merchant needs: real-time AI risk scoring, EDR network integration, MID termination prediction, authorization health monitoring, and weekly intel reports.",
  alternates: { canonical: "https://highriskintel.com/product" },
  openGraph: {
    url: "https://highriskintel.com/product",
    title: "HighRiskIntel Product — AI Risk Engine & Chargeback Prevention",
    description:
      "Real-time transaction scoring, EDR network alerts, MID protection, and analyst-backed risk advisory — all in one dashboard."
  }
};

const FEATURES = [
  {
    title: "AI Risk Engine",
    icon: "◈",
    desc: "Every transaction scored 0–100 in real-time using 40+ signals — BIN data, IP reputation, velocity patterns, buyer geography, device fingerprinting, and email trust.",
    details: ["Country and BIN risk scoring", "IP velocity and proxy detection", "Off-hours and ticket size analysis", "Disposable email flagging"]
  },
  {
    title: "EDR Network",
    icon: "⬡",
    desc: "Connected to Chargebacks911, Verifi, and Ethoca. Dispute alerts arrive before they convert to chargebacks, giving you time to act.",
    details: ["Chargebacks911 live", "Verifi (beta)", "Ethoca (beta)", "Auto-refund on alert"]
  },
  {
    title: "MID Protection",
    icon: "⬟",
    desc: "Predict processor termination 30 days out. We monitor your dispute ratio, reserve levels, and processing patterns continuously.",
    details: ["30-day termination prediction", "Reserve forecasting", "Processor health scoring", "Threshold breach alerts"]
  },
  {
    title: "Authorization Health",
    icon: "◇",
    desc: "Track approval rates, decline rates, and deviations from baseline. Know immediately when your authorization rate is being impacted.",
    details: ["7-day rolling baseline", "Decline reason code analysis", "BIN-level approval rates", "Real-time deviation alerts"]
  },
  {
    title: "Chargeback Analytics",
    icon: "◆",
    desc: "Full dispute lifecycle tracking. Reason code mapping to root causes — friendly fraud, fulfillment failures, or processor errors.",
    details: ["Reason code analysis", "Dispute ratio trending", "Pre-chargeback alerts", "Win/loss tracking"]
  },
  {
    title: "Weekly Intel Reports",
    icon: "▣",
    desc: "White-labeled reports every week covering dispute trends, risk score history, action items, and processor health summary.",
    details: ["Branded PDF reports", "Risk score history", "Action item tracking", "Processor health summary"]
  }
];

export default function ProductPage() {
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

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 80px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 16, display: "block" }}>Product</span>
        <h1 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 52, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 24, maxWidth: 700 }}>
          Every tool a high-risk merchant needs to survive.
        </h1>
        <p style={{ fontSize: 17, color: "#8C8C9A", lineHeight: 1.8, maxWidth: 560, marginBottom: 40 }}>
          HighRiskIntel is a full-stack risk intelligence platform. Real-time scoring, dispute prevention, MID protection, and analyst-backed advisory — all in one dashboard.
        </p>
        <Link href="/signup" style={{ display: "inline-block", background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600 }}>
          Start free trial
        </Link>
      </section>

      {/* Feature grid */}
      <section style={{ background: "#0C0C10", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ padding: "40px 36px", background: "#07070A", borderRight: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: 20, marginBottom: 16, display: "block", opacity: 0.6 }}>{f.icon}</span>
                <h3 style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 12, letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 20 }}>{f.desc}</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {f.details.map((d) => (
                    <li key={d} style={{ fontSize: 12, color: "#55555F", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Ready to protect your MID?
          </h2>
          <p style={{ fontSize: 16, color: "#8C8C9A", marginBottom: 36, lineHeight: 1.7 }}>
            Connect your processor and we&apos;ll start monitoring in minutes. Most merchants are fully onboarded in under 48 hours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/signup" style={{ background: "linear-gradient(180deg,#4F8EF7 0%,#2563EB 100%)", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600 }}>
              Start free trial
            </Link>
            <Link href="/pricing" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#F1F1F3", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500 }}>
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
