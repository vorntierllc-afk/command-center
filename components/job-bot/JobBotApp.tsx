"use client";

import { useState, useTransition } from "react";
import type { JobMatch, JobListing } from "@/lib/job-bot/types";

type SearchResponse = {
  matches: JobMatch[];
  jobs: JobListing[];
};

const sampleJobText = `Remote Support Associate | BrightPath | Remote - US | remote | 20 | 30 | day | $21-$25/hr
Requirements: customer support, crm, chat, communication, remote

Operations Assistant | Cedar Lane | Hybrid - Jersey City, NJ | hybrid | 25 | 40 | day | $24-$28/hr
Requirements: organization, scheduling, email, google workspace, communication
`;

function parseJobText(input: string): JobListing[] {
  return input
    .split("\n\n")
    .map((block, index) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const [header, requirementsLine = "Requirements:"] = block.split("\n");
      const [title, company, location, workPreference, minHours, maxHours, shift, salary] = header
        .split("|")
        .map((part) => part.trim());

      return {
        id: `custom-${index + 1}`,
        title,
        company,
        location,
        workPreference: (workPreference as JobListing["workPreference"]) || "remote",
        minHours: Number(minHours) || undefined,
        maxHours: Number(maxHours) || undefined,
        shift: (shift as JobListing["shift"]) || "flexible",
        salary,
        applyUrl: `https://example.com/apply/${index + 1}`,
        description: `${title} at ${company} in ${location}`,
        requirements: requirementsLine
          .replace("Requirements:", "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };
    });
}

export function JobBotApp() {
  const [resumeText, setResumeText] = useState("");
  const [preferredTitles, setPreferredTitles] = useState("customer support, virtual assistant, analyst");
  const [jobText, setJobText] = useState(sampleJobText);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [preferredShift, setPreferredShift] = useState<"day" | "evening" | "night" | "flexible">(
    "day"
  );
  const [workPreference, setWorkPreference] = useState<"remote" | "hybrid" | "onsite" | "any">(
    "remote"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [applyMessage, setApplyMessage] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const [isApplying, startApply] = useTransition();

  async function handleResumeUpload(file: File) {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/job-bot/resume", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Resume upload failed.");
    }

    setResumeText(data.text);
  }

  function handleSearch() {
    setApplyMessage("");

    startSearch(async () => {
      const response = await fetch("/api/job-bot/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText,
          hoursPerWeek,
          preferredShift,
          workPreference,
          preferredTitles: preferredTitles
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          jobs: parseJobText(jobText)
        })
      });
      const data = (await response.json()) as SearchResponse & { error?: string };

      if (!response.ok) {
        setApplyMessage(data.error || "Search failed.");
        return;
      }

      setMatches(data.matches);
    });
  }

  function handleApply(match: JobMatch) {
    setApplyMessage("");

    startApply(async () => {
      const response = await fetch("/api/job-bot/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          resumeText,
          jobTitle: match.job.title,
          company: match.job.company,
          applyUrl: match.job.applyUrl,
          whyFit: match.applicationAnswers.whyFit,
          availability: match.applicationAnswers.availability
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setApplyMessage(data.error || "Apply prep failed.");
        return;
      }

      setApplyMessage(`${data.message} Packet ready for ${match.job.company}.`);
    });
  }

  return (
    <main className="min-h-screen bg-[#f3efe6] text-[#171717]">
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="rounded-[2rem] border border-black/10 bg-[#fffdf8] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <div className="inline-flex rounded-full bg-[#ff6b35] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white">
              Job Hunter Bot
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-[#111111] sm:text-6xl">
              Search jobs from your resume, filter by your hours, and prep applications fast.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/65">
              Upload your resume, set how many hours you want to work, paste roles from job boards,
              and this bot will rank the best fits and draft application answers for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-black/60">
              <span className="rounded-full border border-black/10 bg-white px-4 py-2">Resume parsing</span>
              <span className="rounded-full border border-black/10 bg-white px-4 py-2">Hours-aware matching</span>
              <span className="rounded-full border border-black/10 bg-white px-4 py-2">Application drafts</span>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-[#171717] p-5 text-white">
                <div className="text-sm text-white/60">Target hours</div>
                <div className="mt-2 text-3xl font-semibold">{hoursPerWeek}</div>
                <div className="text-sm text-white/60">per week</div>
              </div>
              <div className="rounded-[1.5rem] bg-[#0e7490] p-5 text-white">
                <div className="text-sm text-white/70">Work style</div>
                <div className="mt-2 text-3xl font-semibold capitalize">{workPreference}</div>
                <div className="text-sm text-white/70">preference</div>
              </div>
              <div className="rounded-[1.5rem] bg-[#facc15] p-5 text-black">
                <div className="text-sm text-black/60">Best matches</div>
                <div className="mt-2 text-3xl font-semibold">{matches.length}</div>
                <div className="text-sm text-black/60">ranked roles</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-[#111111] p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
            <div className="text-sm uppercase tracking-[0.28em] text-white/45">Profile setup</div>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">Resume PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="block w-full text-sm text-white/80 file:mr-4 file:rounded-full file:border-0 file:bg-[#ff6b35] file:px-4 file:py-2 file:font-semibold file:text-white"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    startUpload(async () => {
                      try {
                        await handleResumeUpload(file);
                      } catch (error) {
                        setApplyMessage(
                          error instanceof Error ? error.message : "Resume upload failed."
                        );
                      }
                    });
                  }}
                />
                <p className="mt-2 text-xs text-white/45">
                  PDF parsing runs locally through the app. You can also paste resume text below.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Resume text</label>
                <textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  className="h-36 w-full rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  placeholder="Paste your resume here if you do not want to upload a PDF."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Hours per week</label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(event) => setHoursPerWeek(Number(event.target.value) || 0)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Preferred shift</label>
                  <select
                    value={preferredShift}
                    onChange={(event) =>
                      setPreferredShift(event.target.value as typeof preferredShift)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  >
                    <option value="day">Day</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Work preference</label>
                  <select
                    value={workPreference}
                    onChange={(event) =>
                      setWorkPreference(event.target.value as typeof workPreference)
                    }
                    className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                    <option value="any">Any</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Preferred titles</label>
                  <input
                    value={preferredTitles}
                    onChange={(event) => setPreferredTitles(event.target.value)}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                    placeholder="support, assistant, analyst"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-medium text-white">Applicant details</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    placeholder="Name"
                  />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    placeholder="Email"
                  />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-black/45">Job input</div>
                <h2 className="mt-2 text-3xl font-semibold">Paste jobs to scan</h2>
              </div>
              <button
                onClick={handleSearch}
                disabled={!resumeText.trim() || isSearching}
                className="rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? "Scanning..." : "Find matches"}
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-black/60">
              Paste one or more jobs using the sample format. If you leave this as-is, the bot uses
              the included demo postings.
            </p>

            <textarea
              value={jobText}
              onChange={(event) => setJobText(event.target.value)}
              className="mt-5 h-[22rem] w-full rounded-[1.5rem] border border-black/10 bg-[#f8f5ee] px-4 py-4 text-sm outline-none"
            />
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-[#fffdf8] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-black/45">
                  Ranked matches
                </div>
                <h2 className="mt-2 text-3xl font-semibold">Best-fit roles first</h2>
              </div>
              {isUploading && <div className="text-sm text-black/50">Parsing resume...</div>}
            </div>

            {applyMessage ? (
              <div className="mt-5 rounded-[1.25rem] border border-[#ff6b35]/20 bg-[#ff6b35]/10 px-4 py-3 text-sm text-black/75">
                {applyMessage}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              {matches.length ? (
                matches.map((match) => (
                  <article
                    key={match.job.id}
                    className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-black/45">
                          {match.job.company}
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-black">{match.job.title}</h3>
                        <p className="mt-2 text-sm text-black/60">
                          {match.job.location} · {match.job.workPreference} ·{" "}
                          {match.job.salary || "Comp not listed"}
                        </p>
                      </div>
                      <div className="rounded-full bg-[#171717] px-4 py-2 text-sm font-semibold text-white">
                        {match.score}% match
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {match.resumeHighlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#0e7490]/20 bg-[#0e7490]/10 px-3 py-1 text-xs font-medium text-[#0e7490]"
                        >
                          {item}
                        </span>
                      ))}
                      {!match.resumeHighlights.length && (
                        <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/55">
                          Few direct keyword matches
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
                      <div>
                        <div className="text-sm font-semibold text-black">Why it ranked</div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-black/65">
                          {match.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                        {match.missingKeywords.length ? (
                          <p className="mt-3 text-xs leading-5 text-black/50">
                            Missing keywords: {match.missingKeywords.slice(0, 4).join(", ")}
                          </p>
                        ) : null}
                      </div>
                      <div className="rounded-[1.25rem] bg-[#f8f5ee] p-4">
                        <div className="text-sm font-semibold text-black">Drafted answer</div>
                        <p className="mt-2 text-sm leading-6 text-black/70">{match.tailoredPitch}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-black/40">
                          Apply status: {match.applyPlan}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApply(match)}
                        disabled={isApplying || !name || !email || !phone || !resumeText.trim()}
                        className="rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isApplying ? "Preparing..." : "Prepare application"}
                      </button>
                      <a
                        href={match.job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/70"
                      >
                        Open job link
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white px-6 py-10 text-sm leading-7 text-black/55">
                  Upload or paste your resume, choose your hours, then click Find matches to rank jobs
                  and generate application packets.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
