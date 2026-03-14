"use client";
import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import type { DashboardChartData } from "@/lib/server/types";

type Period = 7 | 30 | 90;

function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex rounded-xl bg-slate-900 p-0.5">
      {([7, 30, 90] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === p ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {p}d
        </button>
      ))}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    fontSize: 12,
    color: "#f1f5f9"
  },
  itemStyle: { color: "#94a3b8" },
  labelStyle: { color: "#64748b", marginBottom: 4 }
};

function ChartCard({
  title,
  sub,
  children,
  period,
  onPeriodChange
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  return (
    <div className="rounded-[1.75rem] shell-border p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
        </div>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </div>
      {children}
    </div>
  );
}

function formatDate(dateStr: string, period: Period): string {
  const d = new Date(dateStr);
  if (period === 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Analytics({ data }: { data: DashboardChartData }) {
  const [disputePeriod, setDisputePeriod] = useState<Period>(30);
  const [authPeriod, setAuthPeriod] = useState<Period>(30);
  const [volumePeriod, setVolumePeriod] = useState<Period>(30);
  const [refundPeriod, setRefundPeriod] = useState<Period>(30);

  function slice(points: { date: string; value: number }[], period: Period) {
    return points.slice(-period).map(p => ({
      ...p,
      label: formatDate(p.date, period)
    }));
  }

  const disputeData = useMemo(() => slice(data.disputeRatioTrend, disputePeriod), [data, disputePeriod]);
  const authData = useMemo(() => slice(data.authRateTrend, authPeriod), [data, authPeriod]);
  const volumeData = useMemo(() => slice(data.volumeTrend, volumePeriod), [data, volumePeriod]);
  const refundData = useMemo(() => slice(data.refundRatioTrend, refundPeriod), [data, refundPeriod]);

  // Detect volume anomalies (>150% of median)
  const medianVolume = useMemo(() => {
    const sorted = [...volumeData].sort((a, b) => a.value - b.value);
    return sorted[Math.floor(sorted.length / 2)]?.value ?? 0;
  }, [volumeData]);

  const volumeWithAnomalies = useMemo(() =>
    volumeData.map(p => ({ ...p, anomaly: p.value > medianVolume * 1.5 ? p.value : null })),
    [volumeData, medianVolume]
  );

  const disputeLatest = disputeData[disputeData.length - 1]?.value ?? 0;
  const authLatest = authData[authData.length - 1]?.value ?? 0;
  const volumeLatest = volumeData[volumeData.length - 1]?.value ?? 0;
  const refundLatest = refundData[refundData.length - 1]?.value ?? 0;

  return (
    <div className="space-y-6">

      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Dispute Ratio", value: `${disputeLatest.toFixed(2)}%`, color: disputeLatest >= 1.0 ? "text-red-400" : disputeLatest >= 0.9 ? "text-amber-400" : "text-green-400" },
          { label: "Auth Approval Rate", value: `${authLatest.toFixed(1)}%`, color: authLatest < 75 ? "text-red-400" : authLatest < 80 ? "text-amber-400" : "text-green-400" },
          { label: "Daily Volume", value: `$${(volumeLatest / 1000).toFixed(1)}k`, color: "text-white" },
          { label: "Refund Ratio", value: `${refundLatest.toFixed(1)}%`, color: refundLatest >= 15 ? "text-red-400" : refundLatest >= 10 ? "text-amber-400" : "text-green-400" }
        ].map(m => (
          <div key={m.label} className="rounded-[1.5rem] shell-border p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{m.label}</p>
            <p className={`mt-3 text-2xl font-semibold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Dispute ratio trend */}
      <ChartCard
        title="Dispute Ratio Trend"
        sub="Rolling chargeback ratio — warning at 0.9%, monitoring at 1.0%"
        period={disputePeriod}
        onPeriodChange={setDisputePeriod}
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={disputeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="disputeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(3)}%`, "Dispute ratio"]} />
            <ReferenceLine y={0.9} stroke="#F59E0B" strokeDasharray="4 3" label={{ value: "0.9% warning", fill: "#F59E0B", fontSize: 10 }} />
            <ReferenceLine y={1.0} stroke="#EF4444" strokeDasharray="4 3" label={{ value: "1.0% monitoring", fill: "#EF4444", fontSize: 10 }} />
            <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={1.5} fill="url(#disputeGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Authorization rate trend */}
      <ChartCard
        title="Authorization Rate Trend"
        sub="Approval rate over time — drops below 80% indicate processing pressure"
        period={authPeriod}
        onPeriodChange={setAuthPeriod}
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={authData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="authGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[60, 100]} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`, "Auth rate"]} />
            <ReferenceLine y={80} stroke="#F59E0B" strokeDasharray="4 3" label={{ value: "80% baseline", fill: "#F59E0B", fontSize: 10 }} />
            <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={1.5} fill="url(#authGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Daily volume with anomaly detection */}
      <ChartCard
        title="Transaction Volume"
        sub="Daily volume with anomaly detection — spikes above 150% of median flagged"
        period={volumePeriod}
        onPeriodChange={setVolumePeriod}
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={volumeWithAnomalies} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(1)}k`, "Volume"]} />
            <ReferenceLine y={medianVolume * 1.5} stroke="#EF4444" strokeDasharray="4 3" label={{ value: "anomaly threshold", fill: "#EF4444", fontSize: 10 }} />
            <Bar dataKey="value" fill="#3B82F6" opacity={0.7} radius={[3, 3, 0, 0]} />
            <Bar dataKey="anomaly" fill="#EF4444" opacity={0.9} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Refund ratio trend */}
      <ChartCard
        title="Refund Ratio"
        sub="Refunds as a % of total transactions — alert threshold at 15%"
        period={refundPeriod}
        onPeriodChange={setRefundPeriod}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={refundData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)}%`, "Refund ratio"]} />
            <ReferenceLine y={15} stroke="#EF4444" strokeDasharray="4 3" label={{ value: "15% alert threshold", fill: "#EF4444", fontSize: 10 }} />
            <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
