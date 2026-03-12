import Link from "next/link";
import { FAQ } from "@/components/marketing/FAQ";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { Pricing } from "@/components/marketing/Pricing";
import { Logo } from "@/components/shared/Logo";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-[1.75rem] shell-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <Link href="/signin" className="rounded-full border border-slate-700 px-4 py-2 hover:border-amber-300/40 hover:text-amber-100">Sign in</Link>
          <Link href="/signup" className="rounded-full bg-amber-300 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-200">Get started</Link>
        </nav>
      </header>

      <Hero />

      <section id="features" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] shell-border p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-amber-100">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">A front-end experience that leads merchants into real underwriting intake.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Your public site educates the merchant, then signup leads into an onboarding flow where they answer business questions, connect their processor or upload prior statements, and receive a dashboard with either live or staged sample insights while processing completes.
          </p>
        </div>
        <Features />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          "High-risk ecommerce and nutraceuticals",
          "Continuity, subscriptions, and trial funnels",
          "Travel, coaching, digital goods, and offshore acquiring"
        ].map((item) => (
          <div key={item} className="rounded-[1.5rem] shell-border p-5 text-sm text-slate-300">
            {item}
          </div>
        ))}
      </section>

      <section id="faq">
        <FAQ />
      </section>
    </main>
  );
}
