import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HighRiskIntel — Risk Intelligence for High-Risk Merchants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#07070A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          position: "relative",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 60%)",
            pointerEvents: "none"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 60%)",
            pointerEvents: "none"
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#fff",
              fontWeight: 800
            }}
          >
            H
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F1F3", letterSpacing: "-0.5px" }}>
            HighRiskIntel
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#F1F1F3",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: 24,
            maxWidth: 800
          }}
        >
          Risk Intelligence for{" "}
          <span style={{ color: "#60A5FA" }}>High-Risk Merchants.</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: "#8C8C9A",
            lineHeight: 1.6,
            maxWidth: 680,
            marginBottom: 48
          }}
        >
          Monitor authorization health, track chargeback exposure, detect anomalies, and protect your MID — before your processor acts first.
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48 }}>
          {[
            { v: "$2.4B+", l: "Protected volume" },
            { v: "30 days", l: "MID termination warning" },
            { v: "98.6%", l: "Dispute prevention rate" }
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#F1F1F3", letterSpacing: "-0.5px" }}>
                {s.v}
              </span>
              <span style={{ fontSize: 13, color: "#55555F", fontWeight: 500 }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Badge row */}
        <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
          {["SOC 2 Type II", "PCI DSS Level 1", "GDPR Compliant"].map((b) => (
            <div
              key={b}
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                color: "#86EFAC",
                fontWeight: 500,
                display: "flex",
                gap: 6,
                alignItems: "center"
              }}
            >
              ✓ {b}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
