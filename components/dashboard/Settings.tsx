"use client";
import { useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] shell-border p-6">
      <h3 className="mb-5 text-base font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900/50 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-slate-700"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-1"}`} />
      </button>
    </label>
  );
}

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailCritical: true,
    emailWarning: true,
    emailWeeklyReport: true,
    smsCritical: false,
    smsWarning: false
  });
  const [riskTolerances, setRiskTolerances] = useState({
    disputeThreshold: "0.9",
    authDropThreshold: "10",
    volumeSpikeThreshold: "200",
    refundThreshold: "15"
  });

  function toggle(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">

      {/* Business Profile */}
      <Section title="Business Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name" id="businessName">
            <input id="businessName" type="text" defaultValue="Sample Merchant LLC" className={inputCls} />
          </Field>
          <Field label="Website URL" id="websiteUrl">
            <input id="websiteUrl" type="url" defaultValue="https://example.com" className={inputCls} />
          </Field>
          <Field label="Industry / MCC category" id="category">
            <select id="category" className={inputCls}>
              <option>Nutraceuticals / Supplements</option>
              <option>Travel / Hospitality</option>
              <option>Digital Goods / SaaS</option>
              <option>E-Commerce General</option>
              <option>Adult / Dating</option>
              <option>Crypto / NFT</option>
              <option>Other High-Risk</option>
            </select>
          </Field>
          <Field label="Average ticket size" id="avgTicket">
            <input id="avgTicket" type="number" defaultValue="129" className={inputCls} />
          </Field>
          <Field label="Products / Services description" id="products">
            <textarea id="products" rows={3} defaultValue="Health supplements sold via direct response." className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Countries served" id="countries">
            <input id="countries" type="text" defaultValue="US, CA, GB, AU" className={inputCls} placeholder="Comma-separated country codes" />
          </Field>
        </div>
      </Section>

      {/* Risk Tolerance */}
      <Section title="Risk Tolerance Thresholds">
        <p className="mb-4 text-xs text-slate-500">
          Alerts are triggered when these thresholds are breached. Adjust to match your processor requirements.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Dispute ratio warning (%)" id="dispThresh">
            <input
              id="dispThresh"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={riskTolerances.disputeThreshold}
              onChange={e => setRiskTolerances(p => ({ ...p, disputeThreshold: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Auth drop alert threshold (%)" id="authThresh">
            <input
              id="authThresh"
              type="number"
              step="1"
              min="0"
              max="50"
              value={riskTolerances.authDropThreshold}
              onChange={e => setRiskTolerances(p => ({ ...p, authDropThreshold: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Volume spike alert (%)" id="volThresh">
            <input
              id="volThresh"
              type="number"
              step="10"
              min="0"
              max="1000"
              value={riskTolerances.volumeSpikeThreshold}
              onChange={e => setRiskTolerances(p => ({ ...p, volumeSpikeThreshold: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Refund ratio alert (%)" id="refundThresh">
            <input
              id="refundThresh"
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={riskTolerances.refundThreshold}
              onChange={e => setRiskTolerances(p => ({ ...p, refundThreshold: e.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Alert Notifications */}
      <Section title="Alert Notifications">
        <div className="space-y-2">
          <Toggle
            enabled={notifications.emailCritical}
            onToggle={() => toggle("emailCritical")}
            label="Email — Critical alerts"
          />
          <Toggle
            enabled={notifications.emailWarning}
            onToggle={() => toggle("emailWarning")}
            label="Email — Warning alerts"
          />
          <Toggle
            enabled={notifications.emailWeeklyReport}
            onToggle={() => toggle("emailWeeklyReport")}
            label="Email — Weekly intelligence report"
          />
          <Toggle
            enabled={notifications.smsCritical}
            onToggle={() => toggle("smsCritical")}
            label="SMS — Critical alerts only"
          />
          <Toggle
            enabled={notifications.smsWarning}
            onToggle={() => toggle("smsWarning")}
            label="SMS — Warning alerts"
          />
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save settings"}
        </button>
        {saved && <p className="text-sm text-green-400">Settings saved.</p>}
      </div>
    </div>
  );
}
