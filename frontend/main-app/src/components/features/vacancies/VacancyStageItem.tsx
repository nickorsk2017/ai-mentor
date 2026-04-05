"use client";

import { Button } from "@/components/common/ui/Button";

export type VacancyStageItemProps = {
  stage: Entity.VacancyStage;
  index: number;
  isActive: boolean;
  onUpdateStage: (stageId: string, patch: Partial<Entity.VacancyStage>) => void;
  onRemoveStage: (stageId: string) => void;
};

export function VacancyStageItem({
  stage,
  index,
  isActive,
  onUpdateStage,
  onRemoveStage,
}: VacancyStageItemProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg text-zinc-500">{index + 1}.</span>
          {isActive ? (
            <input
              className="w-40 rounded-md border border-zinc-200 px-2 py-1 text-lg text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/5"
              value={stage.name}
              onChange={(e) =>
                onUpdateStage(stage.id, { name: e.target.value })
              }
            />
          ) : (
            <span className="text-lg text-zinc-800">{stage.name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <select
                className="rounded-md border border-zinc-200 px-2 py-1 text-lg text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/5"
                value={stage.status}
                onChange={(e) =>
                  onUpdateStage(stage.id, {
                    status: e.target.value as Entity.VacancyStage["status"],
                  })
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="done">Done</option>
                <option value="failed">Failed</option>
              </select>
              <Button
                appearance="danger"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveStage(stage.id);
                }}
              >
                Remove
              </Button>
            </>
          ) : (
            <span className="text-sm text-zinc-500">{stage.status}</span>
          )}
        </div>
      </div>
      {isActive ? (
        <textarea
          className="mt-1 min-h-[60px] w-full rounded-md border border-zinc-200 px-2 py-1 text-lg text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/5"
          placeholder="Notes: feedback, what went well, what to improve..."
          value={stage.notes}
          onChange={(e) =>
            onUpdateStage(stage.id, { notes: e.target.value })
          }
        />
      ) : (
        stage.notes && (
          <p className="mt-1 text-sm text-zinc-600">{stage.notes}</p>
        )
      )}
    </div>
  );
}
