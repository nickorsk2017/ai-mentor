"use client";

import { useMemo } from "react";

export type InterviewProgressPanelProps = {
  stages: Entity.VacancyStage[];
};

export function InterviewProgressPanel({
  stages,
}: InterviewProgressPanelProps) {
  const totalStages = stages.length;
  const completedStages = stages.filter(stage => stage.status === "done").length;
  const failedStages = stages.filter(stage => stage.status === "failed").length;

  const progressPct =
    totalStages > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((completedStages / totalStages) * 100)),
        )
      : 0;

  const stagesJSX = useMemo(() => {
    if(totalStages === 0) {
      return <div className="text-sm text-zinc-600 mt-2">No stages added to the interview process.</div>;
    }

    return stages.map(stage => {
      return (<>
          <p className="mt-1 text-sm text-zinc-600">
            {completedStages} / {totalStages} stages completed
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {failedStages > 0 && <p className="mt-2 text-sm text-rose-600">
            {`${failedStages} failed stage${failedStages > 1 ? "s" : ""}`}
          </p>}
        </>
      );
    });
  }, [stages]);

  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <p className="text-sm font-medium text-zinc-700">Interview Progress</p>
      {stagesJSX}
    </div>
  );
}
