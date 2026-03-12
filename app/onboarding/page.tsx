import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { requireUser } from "@/lib/server/auth";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <OnboardingForm />
    </main>
  );
}
