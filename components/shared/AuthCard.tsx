"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface AuthCardProps {
  mode: "signin" | "signup";
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      business_name: String(formData.get("business_name") || ""),
      plan: String(formData.get("plan") || "starter")
    };

    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error || "Unable to continue.");
      setLoading(false);
      return;
    }

    router.push(mode === "signup" ? "/onboarding" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] shell-border p-7">
      <h1 className="text-2xl font-semibold text-white">
        {mode === "signup" ? "Create your HighRiskIntel account" : "Sign in to HighRiskIntel"}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {mode === "signup"
          ? "Start with a detailed intake, then connect a processor or upload statements."
          : "Access merchant onboarding, dashboards, alerts, and reporting."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <input name="business_name" placeholder="Business name" className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
        ) : null}
        <input name="email" type="email" placeholder="Email address" className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50" required />
        {mode === "signup" ? (
          <select name="plan" className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50">
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="managed">Managed</option>
          </select>
        ) : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-full bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-70">
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={mode === "signup" ? "/signin" : "/signup"} className="text-amber-100 hover:text-white">
          {mode === "signup" ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
