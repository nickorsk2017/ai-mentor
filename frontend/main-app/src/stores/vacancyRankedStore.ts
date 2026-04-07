"use client";

import { create } from "zustand";
import { getRenkingVacancies } from "@/services/rankingService";
import { getUpdateTimeCV, getUpdateTimeVacancies } from "@/services/mainService";

type VacancyMatchedState = {
  vacancies: Entity.RankedVacancy[];
  loadingVacancies: boolean;
  error: string | null;
  activeVacancyId: string | null;
  timerDelayCvIndexing: NodeJS.Timeout | null;
};

type VacancyMatchedActions = {
  fetchMatchedVacancies: () => Promise<void>;
  setActiveVacancyId: (id: string | null) => void;
  clearStore: () => void;
};

export type VacancyMatchedStore = VacancyMatchedState & VacancyMatchedActions;

const DELAY_TIME_INDEXING = 30000;

export const useVacancyRankingStore = create<VacancyMatchedStore>((set, get) => ({
  vacancies: [],
  loadingVacancies: true,
  error: null,
  activeVacancyId: null,
  timerDelayCvIndexing: null,


  clearStore: () => {
    const { timerDelayCvIndexing } = get();

    clearTimeout(timerDelayCvIndexing);
    set({ vacancies: [], loadingVacancies: true, error: null, timerDelayCvIndexing: null });
  },

  fetchMatchedVacancies: async () => {
    try {
      const { timerDelayCvIndexing, fetchMatchedVacancies } = get();
      const updatedAtTimeVacancies = getUpdateTimeVacancies();
      const updatedAtTimeCV = getUpdateTimeCV();
      const now = Date.now();
      const delayDiffVacancies = updatedAtTimeVacancies === null ? 0 : DELAY_TIME_INDEXING - (now - updatedAtTimeVacancies);
      const delayDiffCV = updatedAtTimeCV === null ? 0 : DELAY_TIME_INDEXING - (now - updatedAtTimeCV);
      const delayDiff = delayDiffCV > delayDiffVacancies ? delayDiffCV : delayDiffVacancies;
      
      clearTimeout(timerDelayCvIndexing);

      if(delayDiff > 0) {

          const timer= setTimeout(() => {
            fetchMatchedVacancies();
          }, delayDiff);

          set({ timerDelayCvIndexing: timer });

      } else {
          set({ loadingVacancies: true, error: null, timerDelayCvIndexing: null });
          const data = await getRenkingVacancies();
          set({ vacancies: data, loadingVacancies: false });
        }  
    } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load vacancies";
          set({ error: message, loadingVacancies: false });
    }
  },

  setActiveVacancyId: (id) => set({ activeVacancyId: id }),
}));
