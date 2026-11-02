import { ShimmerLink } from "@/components/ui/shimmer-button";

// Work on the home page: each job's logo, role, one line about it and its testimonial.

export type Job = {
  key: string;
  company: string;
  logo: { src: string; alt: string };
  role: string;
  dates: string;
  summary: string;
  letter?: string;
};

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8M9 8h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkEntries({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="entries work-entries">
      {jobs.map((job) => (
        <li key={job.key} className="entry-row">
          <img className="logo" src={job.logo.src} alt={job.logo.alt} width={128} height={128} loading="lazy" />
          <div>
            <h3>{job.company}</h3>
            <p className="dateline">
              {job.role}&nbsp;· <span className="nw">{job.dates}</span>
            </p>
            <p>{job.summary}</p>
            {job.letter && (
              <ShimmerLink
                background="#151e28"
                shimmerColor="#d6ebff"
                shimmerSize="2px"
                className="shim gap-1.5 px-3.5 py-1.5 text-[13px] font-medium border-white/25"
                href={job.letter}
                target="_blank"
                rel="noopener"
              >
                Testimonial
                <Arrow />
              </ShimmerLink>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
