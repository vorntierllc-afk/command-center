export type Availability = {
  hoursPerWeek: number;
  preferredShift: "day" | "evening" | "night" | "flexible";
  workPreference: "remote" | "hybrid" | "onsite" | "any";
};

export type ResumeProfile = {
  rawText: string;
  skills: string[];
  keywords: string[];
  yearsOfExperience: number;
  preferredTitles: string[];
};

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  workPreference: "remote" | "hybrid" | "onsite";
  minHours?: number;
  maxHours?: number;
  shift?: "day" | "evening" | "night" | "flexible";
  salary?: string;
  applyUrl: string;
  description: string;
  requirements: string[];
};

export type JobMatch = {
  job: JobListing;
  score: number;
  reasons: string[];
  missingKeywords: string[];
  resumeHighlights: string[];
  tailoredPitch: string;
  applicationAnswers: {
    whyFit: string;
    availability: string;
  };
  applyPlan: "auto-ready" | "needs-review";
};
