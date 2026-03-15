import type { Availability, JobListing, JobMatch, ResumeProfile } from "@/lib/job-bot/types";

const COMMON_SKILLS = [
  "customer support",
  "crm",
  "communication",
  "email",
  "chat",
  "remote",
  "excel",
  "sql",
  "analysis",
  "reporting",
  "dashboards",
  "organization",
  "scheduling",
  "calendar",
  "google workspace",
  "testing",
  "qa",
  "bug reports",
  "web apps",
  "sales",
  "cold outreach",
  "pipeline",
  "warehouse",
  "packing"
];

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values)];
}

export function extractResumeProfile(text: string, preferredTitles: string[] = []): ResumeProfile {
  const lower = text.toLowerCase();
  const tokens = tokenize(text);
  const detectedSkills = COMMON_SKILLS.filter((skill) => lower.includes(skill));
  const yearsMatch = lower.match(/(\d+)\+?\s+years?/);
  const yearsOfExperience = yearsMatch ? Number(yearsMatch[1]) : 0;

  return {
    rawText: text,
    skills: detectedSkills,
    keywords: unique(tokens).slice(0, 120),
    yearsOfExperience,
    preferredTitles
  };
}

function scoreWorkPreference(job: JobListing, availability: Availability) {
  if (availability.workPreference === "any") {
    return 12;
  }

  return availability.workPreference === job.workPreference ? 18 : 0;
}

function scoreHours(job: JobListing, availability: Availability) {
  const hours = availability.hoursPerWeek;
  const min = job.minHours ?? 0;
  const max = job.maxHours ?? 80;

  if (hours >= min && hours <= max) {
    return 24;
  }

  if (hours + 5 >= min && hours - 5 <= max) {
    return 10;
  }

  return -15;
}

function scoreShift(job: JobListing, availability: Availability) {
  if (!job.shift || job.shift === "flexible" || availability.preferredShift === "flexible") {
    return 10;
  }

  return job.shift === availability.preferredShift ? 12 : -8;
}

function scoreSkills(job: JobListing, resume: ResumeProfile) {
  const matched = job.requirements.filter(
    (requirement) =>
      resume.skills.includes(requirement) ||
      resume.keywords.includes(requirement) ||
      resume.rawText.toLowerCase().includes(requirement)
  );

  return {
    score: Math.min(36, matched.length * 6),
    matched
  };
}

function scoreTitle(job: JobListing, resume: ResumeProfile) {
  if (!resume.preferredTitles.length) {
    return 0;
  }

  const title = job.title.toLowerCase();
  const matched = resume.preferredTitles.some((preferredTitle) =>
    title.includes(preferredTitle.toLowerCase())
  );

  return matched ? 12 : 0;
}

function buildPitch(job: JobListing, availability: Availability, matchedSkills: string[]) {
  const skillsText = matchedSkills.slice(0, 3).join(", ") || "transferable experience";

  return `I am interested in ${job.title} at ${job.company} because the role lines up with my background in ${skillsText}. I am available for ${availability.hoursPerWeek} hours per week and can support a ${job.shift ?? "flexible"} schedule.`;
}

export function matchJobs(
  jobs: JobListing[],
  resume: ResumeProfile,
  availability: Availability
): JobMatch[] {
  return jobs
    .map((job) => {
      const skillScore = scoreSkills(job, resume);
      const reasons = [
        `${skillScore.matched.length} requirement matches from your resume`,
        `${availability.hoursPerWeek} hrs/week ${scoreHours(job, availability) >= 10 ? "fits" : "is close to"} this role`,
        `${job.workPreference} setup ${scoreWorkPreference(job, availability) > 0 ? "matches" : "conflicts with"} your preference`
      ];
      const missingKeywords = job.requirements.filter(
        (requirement) => !skillScore.matched.includes(requirement)
      );
      const score =
        20 +
        scoreWorkPreference(job, availability) +
        scoreHours(job, availability) +
        scoreShift(job, availability) +
        skillScore.score +
        scoreTitle(job, resume);

      return {
        job,
        score: Math.max(0, Math.min(100, score)),
        reasons,
        missingKeywords,
        resumeHighlights: skillScore.matched.slice(0, 4),
        tailoredPitch: buildPitch(job, availability, skillScore.matched),
        applicationAnswers: {
          whyFit: buildPitch(job, availability, skillScore.matched),
          availability: `Available ${availability.hoursPerWeek} hours weekly for ${availability.preferredShift} shifts; work preference: ${availability.workPreference}.`
        },
        applyPlan: score >= 70 ? ("auto-ready" as const) : ("needs-review" as const)
      };
    })
    .sort((a, b) => b.score - a.score);
}
