import { SITE_URL } from "@/lib/seo";

export function GET() {
  return new Response(
    `HighRiskIntel is open for indexing by search and answer engines.

Primary sitemap: ${SITE_URL}/sitemap.xml
AI-readable site map: ${SITE_URL}/llms.txt
Important commercial page: ${SITE_URL}/risk-audit
High-risk merchant directory: ${SITE_URL}/high-risk
Tools and resources: ${SITE_URL}/tools/visa-vamp-calculator, ${SITE_URL}/tools/mid-termination-risk-checker, ${SITE_URL}/resources/payment-processor-hold-checklist
`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
