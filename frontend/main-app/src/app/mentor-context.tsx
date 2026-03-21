"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getVacanciesOnBackend } from "../shared/api/vacancyApi";

type StageStatus = "pending" | "done" | "failed";

export type VacancyStage = {
  id: string;
  name: string;
  status: StageStatus;
  notes: string;
};

export type Vacancy = {
  id: string;
  title: string;
  company?: string;
  description: string;
  stages?: VacancyStage[];
  planned_stages: number;
  created_at?: string;
};

export type CV = {
  contentHtml: string;
  uploadedFileName?: string;
};

type MentorState = {
  cv: CV | null;
  vacancies: Vacancy[];
};

type MentorContextValue = MentorState & {
  setCv: (cv: CV) => void;
  /** Append a vacancy (e.g. from POST /vacancies). `stages` default to []. */
  addVacancy: (vacancy: Omit<Vacancy, "stages"> & { stages?: VacancyStage[] }) => void;
  deleteVacancy: (id: string) => void;
  updateVacancy: (id: string, patch: Partial<Omit<Vacancy, "id" | "stages">>) => void;
  updateVacancyStages: (id: string, stages: VacancyStage[]) => void;
  setVacancyPlannedStageCount: (id: string, count: number) => void;
  fetchVacancies: () => Promise<void>;
};

const MentorContext = createContext<MentorContextValue | undefined>(undefined);


export function MentorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MentorState>({ cv: null, vacancies: [] });

  const setCv = useCallback((cv: CV) => {
    setState((prev) => ({ ...prev, cv }));
  }, []);

  const addVacancy = useCallback(
    (vacancy: Omit<Vacancy, "stages"> & { stages?: VacancyStage[] }) => {
      const newVacancy: Vacancy = {
        ...vacancy,
        stages: vacancy.stages ?? [],
      };
      setState((prev) => ({
        ...prev,
        vacancies: [...prev.vacancies, newVacancy],
      }));
    },
    []
  );

  const fetchVacancies = useCallback(async () => {
    const vacancies = await getVacanciesOnBackend();
    setState((prev) => ({ ...prev, vacancies}));
  }, []);

  const deleteVacancy = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      vacancies: prev.vacancies.filter((v) => v.id !== id),
    }));
  }, []);

  const updateVacancy = useCallback(
    (id: string, patch: Partial<Omit<Vacancy, "id" | "stages">>) => {
      setState((prev) => ({
        ...prev,
        vacancies: prev.vacancies.map((v) =>
          v.id === id ? { ...v, ...patch } : v
        ),
      }));
    },
    []
  );

  const updateVacancyStages = useCallback(
    (id: string, stages: VacancyStage[]) => {
      setState((prev) => ({
        ...prev,
        vacancies: prev.vacancies.map((v) =>
          v.id === id ? { ...v, stages } : v
        ),
      }));
    },
    []
  );

  const setVacancyPlannedStageCount = useCallback(
    (id: string, count: number) => {
      setState((prev) => ({
        ...prev,
        vacancies: prev.vacancies.map((v) =>
          v.id === id ? { ...v, planned_stages: count } : v
        ),
      }));
    },
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      setCv,
      addVacancy,
      deleteVacancy,
      updateVacancy,
      updateVacancyStages,
      setVacancyPlannedStageCount,
      fetchVacancies,
    }),
    [state, setCv, addVacancy, deleteVacancy, updateVacancy, updateVacancyStages, setVacancyPlannedStageCount, fetchVacancies]
  );

  return (
    <MentorContext.Provider value={value}>{children}</MentorContext.Provider>
  );
}

export function useMentor() {
  const ctx = useContext(MentorContext);
  if (!ctx) {
    throw new Error("useMentor must be used within MentorProvider");
  }
  return ctx;
}

