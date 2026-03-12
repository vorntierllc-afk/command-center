import type { DashboardOverview } from "@/lib/server/types";

export function generateWeeklyReportSummary(overview: DashboardOverview) {
  return {
    headline: overview.isSample
      ? "Sample dashboard report while merchant data is still processing."
      : "Weekly merchant risk summary.",
    totals: overview,
    generatedAt: new Date().toISOString(),
    recommendations: [
      "Review approval pressure by acquiring partner and MID.",
      "Tighten controls on elevated BIN or country clusters.",
      "Watch dispute ratio and reserve exposure week over week."
    ]
  };
}
