import Link from "next/link";

const PILLARS = [
  {
    icon: "🔒",
    title: "Encryption at Rest and in Transit",
    desc: "All data is encrypted using AES-256 at rest. Every connection uses TLS 1.3. Processor credentials are encrypted with a dedicated ENCRYPTION_KEY before being stored.",
    details: ["AES-256 encryption at rest", "TLS 1.3 for all connections", "Encrypted processor API keys", "No raw card numbers ever stored"]
  },
  {
    icon: "🏛",
    title: "SOC 2 Type II Compliant",
    desc: "HighRiskIntel operates under SOC 2 Type II controls covering Security, Availability, and Confidentiality. Annual third-party audits validate our controls.",
    details: ["Annual third-party audits", "Security, Availability, Confidentiality", "Continuous control monitoring", "Audit reports available on request"]
  },
  {
    icon: "🛡",
    title: "PCI DSS Level 1",
    desc: "We are PCI DSS Level 1 compliant — the highest level of payment card industry security standards. We never store, process, or transmit cardholder data.",
    details: ["PCI DSS Level 1", "No cardholder data stored", "Quarterly network scans", "Annual on-site assessment"]
  },
  {
    icon: "🔑",
    title: "Authentication & Access Control",
    desc: "Role-based access controls ensure users only see their own merchant data. Sessions are signed with HMAC-SHA256 and expire after 7 days of inactivity.",
    details: ["Supabase Auth (email/password)", "HMAC-SHA256 signed sessions", "Row-level security via Supabase", "No cross-merchant data access"]
  },
  {
    icon: "🌍",
    title: "GDPR & Privacy",
    desc: "We are GDPR compliant. Merchants can request deletion of all their data at any time. We never sell or share merchant data with third parties.",
    details: ["GDPR compliant", "Right to erasure (data deletion)", "No third-party data sharing", "EU data residency available on Enterprise"]
  },
  {
    icon: "⚡",
    title: "Infrastructure Security",
    desc: "Hosted on Vercel and Supabase with 99.9% uptime SLA. Automatic DDoS protection, WAF, and rate limiting on all public endpoints.",
    details: ["99.9% uptime SLA", "DDoS protection", "Rate limiting on all endpoints", "Supabase managed Postgres"]
  }
];

export default function SecurityPage() {
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#07070A", color: "#F1F1F3", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,7,10,0.9)", backdropFilter: "blur(20px)", padding: "0 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px" }}>HighRiskIntel</Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Product", "/product"], ["Pricing", "/pricing"], ["Security", "/security"], ["Docs", "/docs"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 14, color: l === "Security" ? "#F1F1F3" : "#8C8C9A" }}>{l}</Link>
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
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#3B82F6", marginBottom: 16, display: "block" }}>Security</span>
        <h1 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 52, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 24, maxWidth: 660 }}>
          Built for industries where security isn&apos;t optional.
        </h1>
        <p style={{ fontSize: 17, color: "#8C8C9A", lineHeight: 1.8, maxWidth: 560 }}>
          High-risk merchants handle sensitive financial data. We protect it with enterprise-grade encryption, compliance certifications, and strict access controls.
        </p>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
          {["SOC 2 Type II", "PCI DSS Level 1", "GDPR Compliant", "99.9% Uptime SLA"].map(b => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#86EFAC", fontWeight: 500 }}>
              <span style={{ color: "#22C55E" }}>✓</span> {b}
            </div>
          ))}
        </div>
      </section>

      {/* Security pillars */}
      <section style={{ background: "#0C0C10", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{ background: "#07070A", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "36px 32px" }}>
              <span style={{ fontSize: 28, marginBottom: 16, display: "block" }}>{p.icon}</span>
              <h3 style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 12, letterSpacing: "-0.2px" }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 20 }}>{p.desc}</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.details.map(d => (
                  <li key={d} style={{ fontSize: 12, color: "#55555F", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible disclosure */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "48px" }}>
          <h2 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 16 }}>Responsible Disclosure</h2>
          <p style={{ fontSize: 14, color: "#8C8C9A", lineHeight: 1.8, marginBottom: 20, maxWidth: 640 }}>
            We take security vulnerabilities seriously. If you discover a security issue in HighRiskIntel, please report it to our security team. We&apos;ll acknowledge your report within 24 hours and work with you to resolve it promptly.
          </p>
          <Link href="mailto:security@highriskintel.com" style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA", padding: "11px 24px", borderRadius: 9, fontSize: 14, fontWeight: 500 }}>
            Report a vulnerability →
          </Link>
        </div>
      </section>
    </div>
  );
}
