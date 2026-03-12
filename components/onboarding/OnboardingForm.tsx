"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { StepAnalyzing } from "@/components/onboarding/StepAnalyzing";
import { StepChoose } from "@/components/onboarding/StepChoose";
import { StepComplete } from "@/components/onboarding/StepComplete";
import { StepConnect } from "@/components/onboarding/StepConnect";
import { StepUpload } from "@/components/onboarding/StepUpload";

export function OnboardingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      businessName: String(formData.get("businessName") || ""),
      websiteUrl: String(formData.get("websiteUrl") || ""),
      merchantCategory: String(formData.get("merchantCategory") || ""),
      productsDescription: String(formData.get("productsDescription") || ""),
      monthlyProcessingVolume: Number(formData.get("monthlyProcessingVolume") || 0),
      averageTicket: Number(formData.get("averageTicket") || 0),
      highestTicket: Number(formData.get("highestTicket") || 0),
      countriesServed: String(formData.get("countriesServed") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      currentProcessor: String(formData.get("currentProcessor") || ""),
      approvalHistory: String(formData.get("approvalHistory") || ""),
      chargebackHistory: String(formData.get("chargebackHistory") || ""),
      reserveHistory: String(formData.get("reserveHistory") || ""),
      processingModel: String(formData.get("processingModel") || ""),
      fulfillmentTimeline: String(formData.get("fulfillmentTimeline") || ""),
      method: String(formData.get("method") || "api")
    };

    await fetch("/api/admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    await new Promise((resolve) => setTimeout(resolve, 4000));
    setCompleted(true);
    router.refresh();
  }

  if (completed) {
    return <StepComplete />;
  }

  return (
    <div className="space-y-5">
      <StepChoose />
      <StepConnect />
      <StepUpload />
      <form className="rounded-[1.75rem] shell-border p-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-white">Merchant intake survey</h2>
        <p className="mt-2 text-sm text-slate-400">
          Capture what the merchant sells, how approvals look, what volume is being processed, and any reserve or chargeback history before risk monitoring starts.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="businessName" placeholder="Business name" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
          <input name="websiteUrl" placeholder="Website URL" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <input name="merchantCategory" placeholder="Merchant category / MCC" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
          <input name="currentProcessor" placeholder="Current processor" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <input name="monthlyProcessingVolume" type="number" placeholder="Monthly processing volume" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
          <input name="averageTicket" type="number" placeholder="Average ticket size" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
          <input name="highestTicket" type="number" placeholder="Highest ticket size" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
          <input name="countriesServed" placeholder="Countries served (comma separated)" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <select name="processingModel" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50">
            <option value="one-time">One-time sales</option>
            <option value="subscription">Subscription / recurring</option>
            <option value="trial">Trial / continuity</option>
            <option value="mixed">Mixed</option>
          </select>
          <select name="method" className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50">
            <option value="api">Connect processor API</option>
            <option value="upload">Upload statements</option>
          </select>
          <textarea name="productsDescription" placeholder="What does the business sell?" className="min-h-28 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50 md:col-span-2" required />
          <textarea name="approvalHistory" placeholder="Approval history and current approval rate" className="min-h-28 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <textarea name="chargebackHistory" placeholder="Chargeback and dispute history" className="min-h-28 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <textarea name="reserveHistory" placeholder="Reserve, termination, or funding hold history" className="min-h-28 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
          <textarea name="fulfillmentTimeline" placeholder="Fulfillment timeline and delivery model" className="min-h-28 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" />
        </div>

        <button disabled={submitting} className="mt-6 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-70">
          {submitting ? "Analyzing..." : "Submit onboarding"}
        </button>
      </form>
      {submitting ? <StepAnalyzing /> : null}
    </div>
  );
}
