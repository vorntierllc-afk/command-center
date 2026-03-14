import type { Metadata } from "next";
import { HRIAuthPage } from "@/components/hri";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your HighRiskIntel merchant dashboard.",
  robots: { index: false, follow: false }
};

export default function SignInPage() {
  return <HRIAuthPage mode="signin" />;
}
