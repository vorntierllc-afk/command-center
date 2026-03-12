import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HighRiskIntel",
  description: "Managed risk intelligence for high-risk merchants."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
