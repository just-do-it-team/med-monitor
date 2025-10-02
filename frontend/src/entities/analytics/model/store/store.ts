import { create } from "zustand";
import { AnalyticsStateType } from "@/entities/analytics/model/types/types.ts";

export const useAnalyticsStore = create<AnalyticsStateType>()((set) => ({
  analysisText: null,

  isModalOpen: false,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setAnalysisText: (s) => set({ analysisText: s }),
}));
