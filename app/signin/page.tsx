import { AuthCard } from "@/components/shared/AuthCard";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <AuthCard mode="signin" />
    </main>
  );
}
