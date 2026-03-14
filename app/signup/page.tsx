import type { Metadata } from "next";
import { HRIAuthPage } from "@/components/hri";

export const metadata: Metadata = {
  title: "Sign Up — Start Your Free Trial",
  description: "Create your HighRiskIntel account and start monitoring your merchant risk in minutes.",
  robots: { index: false, follow: false }
};

export default function SignUpPage() {
  return <HRIAuthPage mode="signup" />;
}
