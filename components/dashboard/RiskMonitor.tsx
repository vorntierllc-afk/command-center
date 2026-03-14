import { scoreMerchantRisk, riskStatusColor, riskStatusLabel } from "@/lib/risk-engine/merchant-scorer";

const SAMPLE_INPUT = {
  disputeRatio: 0.78,
  authDeviation: 5.2,
  volumeSpike: 1.3,
  refundRatio: 9.4,
  crossBorderRatio: 22
};

function ScoreBar({ label, contribution, max, color }: {
  label: string;
  contribution: number;
  max: number;
  color: string;
}) {
  const pct = (contribution / max) * 100;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-white">{contribution} / {max} pts</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

const RULES = [
  {
    label: "Dispute ratio",
    desc: "Proportion of transactions resulting in chargebacks. Threshold: 0.9% warning, 1.0% monitoring.",
    key: "dispute_ratio",
    weight: 40
  },
  {
    label: "Authorization deviation",
    desc: "Drop in approval rate vs 7-day baseline. Alert triggers at -10% deviation.",
    key: "auth_deviation",
    weight: 20
  },
  {
    label: "Volume spike",
    desc: "Abnormal transaction volume increase. Alert triggers at 200% above normal.",
    key: "volume_spike",
    weight: 15
  },
  {
    label: "Refund ratio",
    desc: "Proportion of transactions resulting in refunds. Alert triggers at 15%.",
    key: "refund_ratio",
    weight: 15
  },
  {
    label: "Cross-border ratio",
    desc: "Share of transactions originating outside primary jurisdiction.",
    key: "cross_border",
    weight: 10
  }
];

export function RiskMonitor() {
  const result = scoreMerchantRisk(SAMPLE_INPUT);
  const statusColor = riskStatusColor(result.status);

  return (
    <div className="space-y-6">

      {/* Score summary */}
      <div className="rounded-[1.75rem] shell-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Risk Score Breakdown</h2>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}50` }}
          >
            {riskStatusLabel(result.status)}
          </span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{result.score}</span>
          <span className="mb-1 text-slate-500">/ 100</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${result.score}%`, background: statusColor }}
          />
        </div>
        <div className="mt-5 space-y-3">
          <ScoreBar label="Dispute ratio" contribution={result.breakdown.disputeContribution} max={40} color="#EF4444" />
          <ScoreBar label="Auth deviation" contribution={result.breakdown.authContribution} max={20} color="#F59E0B" />
          <ScoreBar label="Volume spike" contribution={result.breakdown.volumeContribution} max={15} color="#F59E0B" />
          <ScoreBar label="Refund ratio" contribution={result.breakdown.refundContribution} max={15} color="#3B82F6" />
          <ScoreBar label="Cross-border" contribution={result.breakdown.crossBorderContribution} max={10} color="#8B5CF6" />
        </div>
      </div>

      {/* Rule engine detail */}
      <div className="rounded-[1.75rem] shell-border p-6">
        <h2 className="mb-5 text-base font-semibold text-white">Scoring Engine Rules</h2>
        <div className="space-y-3">
          {RULES.map((rule) => (
            <div key={rule.key} className="rounded-2xl bg-slate-900/60 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{rule.label}</p>
                <span className="text-xs text-slate-500">{rule.weight} pts max</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status key */}
      <div className="rounded-[1.75rem] shell-border p-6">
        <h2 className="mb-4 text-base font-semibold text-white">Risk Status Reference</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Stable", range: "0 – 40", color: "#22C55E", desc: "Processing within acceptable risk parameters." },
            { label: "Elevated", range: "41 – 70", color: "#F59E0B", desc: "Attention required. Monitor closely and take action." },
            { label: "Critical", range: "71 – 100", color: "#EF4444", desc: "Immediate intervention required. MID at risk." }
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-900/60 p-4" style={{ borderTop: `2px solid ${s.color}50` }}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-sm font-semibold text-white">{s.label}</span>
                <span className="ml-auto text-xs text-slate-500">{s.range}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
