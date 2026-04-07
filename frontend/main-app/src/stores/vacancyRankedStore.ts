"use client";

import { create } from "zustand";
import { getRenkingVacancies } from "@/services/rankingService";
import { getUpdateTimeVacancies } from "@/services/mainService";

type VacancyMatchedState = {
  vacancies: Entity.RankedVacancy[];
  loadingVacancies: boolean;
  vacanciesError: string | null;
  activeVacancyId: string | null;
  timerDelayCvIndexing: NodeJS.Timeout | null;
};

type VacancyMatchedActions = {
  fetchMatchedVacancies: () => Promise<void>;
  setActiveVacancyId: (id: string | null) => void;
  clearStore: () => void;
};

export type VacancyMatchedStore = VacancyMatchedState & VacancyMatchedActions;

export const useVacancyRankingStore = create<VacancyMatchedStore>((set, get) => ({
  vacancies: [],
  loadingVacancies: true,
  vacanciesError: null,
  activeVacancyId: null,
  timerDelayCvIndexing: null,


  clearStore: () => {
    const { timerDelayCvIndexing } = get();

    clearTimeout(timerDelayCvIndexing);
    set({ vacancies: [], loadingVacancies: true, vacanciesError: null, timerDelayCvIndexing: null });
  },

  fetchMatchedVacancies: async () => {
    try {
      const { timerDelayCvIndexing, fetchMatchedVacancies } = get();
      const cvUpdatedAt = getUpdateTimeVacancies();
      const now = Date.now();
      const delaytimeCvUpdated = 50000;
      const delayDiff = cvUpdatedAt === null ? 0 : now - cvUpdatedAt;

      clearTimeout(timerDelayCvIndexing);

      if(delayDiff > 0 && delayDiff < delaytimeCvUpdated) {

          const timer= setTimeout(() => {
            fetchMatchedVacancies();
          }, delayDiff);

          set({ timerDelayCvIndexing: timer });

      } else {
          set({ loadingVacancies: true, vacanciesError: null });
          const data = await getRenkingVacancies();
          set({ vacancies: data, loadingVacancies: false });
        }  
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load vacancies";
          set({ vacanciesError: message, loadingVacancies: false });
      }
  },

  setActiveVacancyId: (id) => set({ activeVacancyId: id }),
}));
