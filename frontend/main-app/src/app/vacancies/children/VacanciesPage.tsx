"use client";

import { useEffect, useState } from "react";
import { useMentor, VacancyStage } from "../../mentor-context";
import { Modal } from "../../../shared/ui/Modal";
import { Button } from "@/shared/ui/Button";
import { VacancyCard } from "./VacancyCard";
import {
  createVacancyOnBackend,
  updateVacancyOnBackend,
} from "@/shared/api/vacancyApi";

export function VacanciesPage() {
  const {
    vacancies,
    addVacancy,
    deleteVacancy,
    updateVacancy,
    updateVacancyStages,
    setVacancyPlannedStageCount,
    fetchVacancies,
  } = useMentor();

  const [stageCountModalVacancyId, setStageCountModalVacancyId] =
    useState<string | null>(null);
  const [stageCountInput, setStageCountInput] = useState<string>("");
  const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);
  const [savingVacancyId, setSavingVacancyId] = useState<string | null>(null);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const handleAddVacancy = async () => {
    const draft = {
      title: "New vacancy",
      company: "",
      description: "",
    };

    const saved = await createVacancyOnBackend(draft);
    addVacancy(saved);
  };

  const addStage = (vacancyId: string) => {
    const newStage: VacancyStage = {
      id: crypto.randomUUID(),
      name: "New stage",
      status: "pending",
      notes: "",
    };
    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return;
    updateVacancyStages(vacancyId, [...vacancy.stages??[], newStage]);
  };

  const updateStage = (
    vacancyId: string,
    stageId: string,
    patch: Partial<VacancyStage>
  ) => {
    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return;
    const stages = vacancy.stages?.map((s) =>
      s.id === stageId ? { ...s, ...patch } : s
    ) ?? [];
    updateVacancyStages(vacancyId, stages);
  };

  const removeStage = (vacancyId: string, stageId: string) => {
    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return;

    updateVacancyStages(
      vacancyId,
      vacancy.stages?.filter((s) => s.id !== stageId) ?? []
    );
  };

  const openStageCountModal = (vacancyId: string) => {
    setStageCountModalVacancyId(vacancyId);
    setStageCountInput("");
  };

  const saveStageCountAndAddStage = () => {
    if (!stageCountModalVacancyId) return;
    const parsed = parseInt(stageCountInput, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setVacancyPlannedStageCount(stageCountModalVacancyId, parsed);
    }
    addStage(stageCountModalVacancyId);
    setStageCountModalVacancyId(null);
    setStageCountInput("");
  };

  const handleSaveVacancy = async (vacancyId: string) => {
    const v = vacancies.find((x) => x.id === vacancyId);
    if (!v) return;
    setSavingVacancyId(vacancyId);
    try {
      const mapped = await updateVacancyOnBackend(vacancyId, {
        title: v.title,
        company: v.company,
        description: v.description,
        planned_stages: v.planned_stages,
        stages: v.stages ?? [],
      });
      updateVacancy(mapped.id, {
        title: mapped.title,
        company: mapped.company,
        description: mapped.description,
        planned_stages: mapped.planned_stages,
        created_at: mapped.created_at,
      });
      updateVacancyStages(mapped.id, mapped.stages ?? []);
    } catch (e) {
      console.error(e);
      window.alert("Could not save vacancy. Check the API is running.");
    } finally {
      setSavingVacancyId(null);
    }
  };

  return (
      <section className="flex w-full flex-col gap-4">
        <header className="flex flex-col">
          <h1 className="text-[30px] font-semibold text-zinc-950">Vacancies</h1>
        </header>

        <div className="flex flex-col gap-3">
          {vacancies.length === 0 ? (
            <p className="text-lg text-zinc-500">
              No vacancies added yet. Start by adding a role above.
            </p>
          ) : (
            vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                isActive={vacancy.id === activeVacancyId && activeVacancyId !== null}
                isSaving={savingVacancyId === vacancy.id}
                onActivate={() => setActiveVacancyId(vacancy.id)}
                onDeactivate={() => setActiveVacancyId(null)}
                onDelete={() => deleteVacancy(vacancy.id)}
                onSave={() => handleSaveVacancy(vacancy.id)}
                onOpenStageCountModal={() => openStageCountModal(vacancy.id)}
                onUpdateVacancy={(patch) => updateVacancy(vacancy.id, patch)}
                onUpdateStage={(stageId, patch) =>
                  updateStage(vacancy.id, stageId, patch)
                }
                onRemoveStage={(stageId) => removeStage(vacancy.id, stageId)}
              />
            ))
          )}
          <Button
            type="button"
            onClick={handleAddVacancy}
            appearance="violet"
            className="self-end !sticky !bottom-2 z-45"
          >
            Add vacancy
          </Button>
        </div>

        <Modal
          open={stageCountModalVacancyId !== null}
          title="Do you know count of stages?"
          description="If you know how many stages this process has, enter it below. This number is stored and used in your analytics."
          onClose={() => {
            setStageCountModalVacancyId(null);
            setStageCountInput("");
          }}
        >
          <div className="flex flex-col gap-3 text-lg">
            <label className="flex flex-col gap-1">
              <span className="font-medium text-zinc-800">
                Planned number of stages
              </span>
              <input
                type="number"
                min={1}
                className="w-32 rounded-md border border-zinc-200 px-2 py-1 text-lg text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/5"
                value={stageCountInput}
                onChange={(e) => setStageCountInput(e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setStageCountModalVacancyId(null);
                  setStageCountInput("");
                }}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-lg font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={saveStageCountAndAddStage}
                className="rounded-full bg-zinc-900 px-4 py-1 text-lg font-semibold text-white hover:bg-zinc-800"
              >
                Save & add stage
              </button>
            </div>
          </div>
        </Modal>
      </section>
  );
}
