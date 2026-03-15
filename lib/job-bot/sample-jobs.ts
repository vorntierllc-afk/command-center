import type { JobListing } from "@/lib/job-bot/types";

export const sampleJobs: JobListing[] = [
  {
    id: "job-1",
    title: "Remote Customer Support Specialist",
    company: "Northline Health",
    location: "Remote - US",
    workPreference: "remote",
    minHours: 20,
    maxHours: 35,
    shift: "day",
    salary: "$22-$26/hr",
    applyUrl: "https://example.com/jobs/customer-support-specialist",
    description:
      "Help customers over chat and email, document tickets, and escalate technical issues to product teams.",
    requirements: ["customer support", "crm", "communication", "email", "chat", "remote"]
  },
  {
    id: "job-2",
    title: "Junior Data Analyst",
    company: "Atlas Insights",
    location: "Hybrid - New York, NY",
    workPreference: "hybrid",
    minHours: 30,
    maxHours: 40,
    shift: "day",
    salary: "$58,000-$68,000",
    applyUrl: "https://example.com/jobs/junior-data-analyst",
    description:
      "Build dashboards, clean CSV exports, and turn business questions into weekly performance reports.",
    requirements: ["excel", "sql", "analysis", "reporting", "dashboards", "communication"]
  },
  {
    id: "job-3",
    title: "Evening Virtual Assistant",
    company: "Foundry Ops",
    location: "Remote - US",
    workPreference: "remote",
    minHours: 15,
    maxHours: 25,
    shift: "evening",
    salary: "$20-$24/hr",
    applyUrl: "https://example.com/jobs/evening-virtual-assistant",
    description:
      "Manage inboxes, coordinate calendars, summarize calls, and keep internal docs organized for a busy operations team.",
    requirements: ["organization", "scheduling", "calendar", "email", "google workspace", "communication"]
  },
  {
    id: "job-4",
    title: "Part-Time Software QA Tester",
    company: "Signal Loop",
    location: "Remote - US",
    workPreference: "remote",
    minHours: 10,
    maxHours: 20,
    shift: "flexible",
    salary: "$28-$35/hr",
    applyUrl: "https://example.com/jobs/software-qa-tester",
    description:
      "Run regression tests, report bugs clearly, and verify fixes across a modern web application.",
    requirements: ["testing", "bug reports", "qa", "web apps", "detail oriented", "communication"]
  },
  {
    id: "job-5",
    title: "Warehouse Associate",
    company: "Metro Fulfillment",
    location: "Newark, NJ",
    workPreference: "onsite",
    minHours: 35,
    maxHours: 40,
    shift: "night",
    salary: "$19-$21/hr",
    applyUrl: "https://example.com/jobs/warehouse-associate",
    description:
      "Pick, pack, and stage outbound orders in a fast-moving warehouse environment.",
    requirements: ["lifting", "warehouse", "packing", "night shift", "reliable transportation"]
  },
  {
    id: "job-6",
    title: "Remote Sales Development Rep",
    company: "Orbit CRM",
    location: "Remote - US",
    workPreference: "remote",
    minHours: 35,
    maxHours: 40,
    shift: "day",
    salary: "$50,000 base + commission",
    applyUrl: "https://example.com/jobs/sdr",
    description:
      "Prospect leads, manage outbound email sequences, and book demos for the account executive team.",
    requirements: ["sales", "cold outreach", "crm", "communication", "pipeline", "remote"]
  }
];
