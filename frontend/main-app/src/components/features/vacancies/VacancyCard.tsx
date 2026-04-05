"use client";

import { useEffect, useMemo, useRef } from "react";
import cx from "@/utils/cx";
import { Button } from "@/components/common/ui/Button";
import { RichEditor } from "@/components/common/ui/RichEditor";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/common/icons";
import { VacancyStagesList } from "@/components/features/vacancies/VacancyStagesList";

type VacancyCardProps = {
  vacancy: Entity.Vacancy;
  isActive: boolean;
  isSaving?: boolean;
  onToggle: (isActive?: boolean) => void;
  onDelete: () => void;
  onOpenStageCountModal: () => void;
  onUpdateVacancy: (patch: Partial<Entity.Vacancy>) => void;
  onUpdateStages: (stages: Entity.VacancyStage[]) => void;
  onRemoveStage: (stageId: string) => void;
};

export function VacancyCard({
  vacancy,
  isActive,
  isSaving = false,
  onToggle,
  onDelete,
  onOpenStageCountModal,
  onUpdateVacancy,
  onUpdateStages,
  onRemoveStage,
}: VacancyCardProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const stages = vacancy.stages ?? [];

  useEffect(() => {
    if (!isActive) return;

    const title = vacancy.title.trim();

    if (!title) {
      titleRef.current?.focus();
    }

  }, [isActive, vacancy.title]);

  const buttonsJSX = useMemo(() => {
    return (
      <div onMouseUp={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} className="absolute right-4 top-[40px] z-40 flex items-center gap-2">
        <Button
          type="button"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          appearance="danger"
        >
          Delete
        </Button>

        <Button
          type="button"
          size="small"
          onMouseDown={(e) =>  {onToggle(); e.stopPropagation()}}
        >
        {isActive ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
      </div>
    );
  }, [isActive, isSaving, onToggle, onDelete]);

  useEffect(() => {
    if (isActive) {
     // titleRef.current?.focus();
    }
  }, [isActive]);

  return (
    <article
      className={cx(`relative flex flex-col cursor-pointer bg-white w-full`, !isActive && "mt-[20px]")}
    >
      {isActive && <div className="sticky top-[72px] h-[20px] w-full bg-white z-50"></div>}
      <div className={cx("flex flex-col relative bg-white")}>
        <header className={cx("top-18 z-40 bg-white/70 backdrop-blur z-50 rounded-2xl !border-b-0 !rounded-b-none border border-gray-300 duration-200", isActive ? "border-violet-500 sticky " : "static border-gray-300")}>
        <div onMouseDown={() => {if(!isActive) onToggle()}} className={cx("flex flex-col gap-2  p-4 bg-transparent", isActive ? "border-violet-500" : "border-gray-300")}>
            <input
              ref={titleRef}
              className="w-full max-w-[760px] border-none bg-transparent text-[20px] font-semibold leading-tight tracking-[-0.01em] text-zinc-900 outline-none focus:ring-0 placeholder:text-zinc-400"
              value={vacancy.title}
              onMouseUp={(e) => e.stopPropagation()}
              onChange={(e) => {
                onUpdateVacancy({ title: e.target.value })}
              }
              placeholder="Vacancy title"
              onFocus={(e) => onToggle(true)}
            />
            <input
              onMouseUp={(e) => e.stopPropagation()}
              className="w-full max-w-[620px] border-none bg-transparent text-[18px] font-medium leading-tight text-zinc-500 outline-none focus:ring-0 placeholder:text-zinc-400"
              value={vacancy.company ?? ""}
              onChange={(e) => onUpdateVacancy({ company: e.target.value })}
              placeholder="Company"
              onFocus={(e) => onToggle(true)}
            />
            
            {buttonsJSX}
          </div>      
        </header>

        <div className={cx("flex flex-col gap-2 px-4  border !border-t-0 !border-b-0 bg-white", isActive ? "border-violet-500 " : "static border-gray-300")}>
          {isActive && <RichEditor
            size="small"
            ref={descriptionRef}
            onMouseUp={(e) => e.stopPropagation()}
            className="max-h-auto mt-2 w-full"
            classToolbar="!top-[158px]"
            valueHtml={vacancy.description}
            placeholder="Vacancy description"
            onChangeHtml={(next) =>
              onUpdateVacancy({
                description: next,
              })
            }
          />}

          <div className="flex items-center justify-between">
            <span></span>
            {stages.length > 0 && (
              <span className="text-lg text-zinc-500">
                Planned: {stages.length} stages
              </span>
            )}
            {isActive && <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStageCountModal();
              }}
            >
              Add stage
            </Button>}
          </div>
          <VacancyStagesList
            stages={vacancy.stages}
            isActive={isActive}
            onUpdateStages={onUpdateStages}
            onRemoveStage={onRemoveStage}
          />
        </div> 
      </div>
      
      <div className={cx("flex flex-col gap-2 sticky top-0 z-50 border !border-t-0 rounded-2xl !rounded-t-none h-4 shadow-[0_8px_20px_rgba(17,24,39,0.07)]", isActive ? "border-violet-500" : "border-gray-300")}>
          
      </div>
      
    </article>
  );
}

