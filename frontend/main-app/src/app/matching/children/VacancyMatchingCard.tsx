"use client";

import React, { useMemo } from "react";
import type { Vacancy } from "../../mentor-context";

export type RankedVacancy = Vacancy & {
  fitScore: number;
  completedStages: number;
  totalStages: number;
  failedStages: number;
  recommendations: string[];
};

type VacancyMatchingCardProps = {
  vacancy: RankedVacancy;
  index: number;
  isActive: boolean;
  onActivate: () => void;
};

export function VacancyMatchingCard({
  vacancy,
  index,
  isActive,
  onActivate,
}: VacancyMatchingCardProps) {

  const headerJSX = useMemo(() => {
    return (
      <header className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-zinc-400">#{index}</span>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-zinc-900">
            {vacancy.title || "Untitled vacancy"}
          </h2>
          {vacancy.company && (
            <p className="text-[11px] text-zinc-600">{vacancy.company}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] font-medium text-zinc-500">Fit score</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${vacancy.fitScore}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-zinc-900">
            {vacancy.fitScore}%
          </span>
        </div>
      </div>
    </header>
    );
  }, [index]);

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm cursor-pointer ${
        isActive ? "border-violet-500" : "border-zinc-200"
      }`}
      onClick={onActivate}
    >
      {headerJSX}

      {isActive && vacancy.description && (
        <div
          className="prose prose-sm max-w-none text-zinc-600"
          dangerouslySetInnerHTML={{ __html: vacancy.description }}
        />
      )}

      <div className="grid gap-2 text-[11px] md:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg bg-zinc-50 p-2">
          <span className="font-medium text-zinc-700">Interview progress</span>
          <span className="text-zinc-600">
            {vacancy.completedStages} / {vacancy.totalStages} stages completed
          </span>
          {vacancy.failedStages > 0 && (
            <span className="text-red-600">
              {vacancy.failedStages} failed stage
              {vacancy.failedStages > 1 ? "s" : ""}
            </span>
          )}
          {vacancy.totalStages === 0 && (
            <span className="text-zinc-500">No stages tracked yet.</span>
          )}
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-zinc-50 p-2">
          <span className="font-medium text-zinc-700">CV keyword overlap</span>
          <span className="text-zinc-600">
            Fit score combines keyword overlap between your CV and the vacancy
            with your interview progress.
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-emerald-50 p-2">
          <span className="font-medium text-emerald-800">
            AI-style recommendations
          </span>
          {vacancy.recommendations.length === 0 ? (
            <span className="text-emerald-700">
              Keep going – this role looks like a reasonable fit based on current
              signals.
            </span>
          ) : (
            <ul className="ml-4 list-disc space-y-1 text-emerald-800">
              {vacancy.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

