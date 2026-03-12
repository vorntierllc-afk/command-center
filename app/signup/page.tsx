import { AuthCard } from "@/components/shared/AuthCard";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <AuthCard mode="signup" />
    </main>
  );
}
