"use client";

import { create } from "zustand";
import { getRenkingVacancies } from "@/services/rankingService";
import { getUpdatedTimeCV, getUpdatedTimeVacancies } from "@/services/mainService";

type VacancyMatchedState = {
  vacancies: Entity.RankedVacancy[];
  loadingVacancies: boolean;
  vacanciesError: string | null;
  activeVacancyId: string | null;
  timerForIndexing: NodeJS.Timeout | null;
};

type VacancyMatchedActions = {
  fetchMatchedVacancies: () => Promise<void>;
  setActiveVacancyId: (id: string | null) => void;
  clearStore: () => void;
};

const DELAY_TIME_INDEXING = 50000;

export type VacancyMatchedStore = VacancyMatchedState & VacancyMatchedActions;

export const useVacancyRankingStore = create<VacancyMatchedStore>((set, get) => ({
  vacancies: [],
  loadingVacancies: true,
  vacanciesError: null,
  activeVacancyId: null,
  timerForIndexing: null,


  clearStore: () => {
    const { timerForIndexing } = get();

    clearTimeout(timerForIndexing);
    set({ vacancies: [], loadingVacancies: true, vacanciesError: null, timerForIndexing: null });
  },

  fetchMatchedVacancies: async () => {
    try {
      const { timerForIndexing, fetchMatchedVacancies } = get();
      const now = Date.now();
      const updatedTimeVacanciesDiff = DELAY_TIME_INDEXING - (now - getUpdatedTimeVacancies());
      const updatedTimeCVDiff = DELAY_TIME_INDEXING - (now - getUpdatedTimeCV());
      const delayDiff = updatedTimeCVDiff > updatedTimeVacanciesDiff ? updatedTimeCVDiff : updatedTimeVacanciesDiff;

      clearTimeout(timerForIndexing);

      console.log("delayDiff", delayDiff);

      if(delayDiff > 0) {

          const timer= setTimeout(() => {
            fetchMatchedVacancies();
          }, delayDiff);

          set({ timerForIndexing: timer });

      } else {
          set({ loadingVacancies: true, vacanciesError: null, timerForIndexing: null });
          const data = await getRenkingVacancies();
          set({ vacancies: data, loadingVacancies: false});
        }  
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load vacancies";
          set({ vacanciesError: message, loadingVacancies: false });
      }
  },

  setActiveVacancyId: (id) => set({ activeVacancyId: id }),
}));
