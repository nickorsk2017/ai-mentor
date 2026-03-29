"use client";

import { create } from "zustand";
import { getVacanciesOnBackend } from "@/services/vacancyService";

type VacancyState = {
  vacancies: Entity.Vacancy[];
};

type VacancyActions = {
  addVacancy: (vacancy: Entity.Vacancy) => void;
  deleteVacancy: (id: string) => void;
  updateVacancy: (id: string, patch: Partial<Entity.Vacancy>) => void;
  updateVacancyStages: (id: string, stages: Entity.VacancyStage[]) => void;
  fetchVacancies: () => Promise<void>;
};

export type VacancyStore = VacancyState & VacancyActions;

export const useVacancyStore = create<VacancyStore>((set) => ({
  vacancies: [],

  addVacancy: (vacancy) =>
    set((state) => ({ vacancies: [...state.vacancies, vacancy] })),

  fetchVacancies: async () => {
    const data = await getVacanciesOnBackend();
    set({ vacancies: data.vacancies });
  },

  deleteVacancy: (id) =>
    set((state) => ({
      vacancies: state.vacancies.filter((vacancy) => vacancy.id !== id),
    })),

  updateVacancy: (id, patch) =>
    set((state) => ({
      vacancies: state.vacancies.map((vacancy) =>
        vacancy.id === id ? { ...vacancy, ...patch } : vacancy
      ),
    })),

  updateVacancyStages: (id, stages) =>
    set((s) => ({
      vacancies: s.vacancies.map((vacancy) =>
        vacancy.id === id ? { ...vacancy, stages } : vacancy
      ),
    })),

}));
