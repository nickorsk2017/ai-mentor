"use client";

import { VacancyStageItem } from "@/components/features/vacancies/VacancyStageItem";

export type VacancyStagesListProps = {
  stages: Entity.VacancyStage[] | undefined;
  isActive: boolean;
  onUpdateStages: (stages: Entity.VacancyStage[]) => void;
  onRemoveStage: (stageId: string) => void;
};

export function VacancyStagesList({
  stages,
  isActive,
  onUpdateStages,
  onRemoveStage,
}: VacancyStagesListProps) {
  if (!isActive) return null;

  const onUpdateStage = (stageId: string, patch: Partial<Entity.VacancyStage>) => {
    onUpdateStages(
      stages?.map((s) => (s.id === stageId ? { ...s, ...patch } : s)) ?? [],
    );
  };

  if (!stages?.length) {
    return (
      <p className="text-lg text-zinc-500">
        No stages yet. Add the first one to track your progress.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {stages.map((stage, index) => (
        <VacancyStageItem
          key={stage.id}
          stage={stage}
          index={index}
          isActive={isActive}
          onUpdateStage={onUpdateStage}
          onRemoveStage={onRemoveStage}
        />
      ))}
    </div>
  );
}
