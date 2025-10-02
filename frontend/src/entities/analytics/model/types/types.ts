export type AnalysisType = { decision: string };

export type AnalyticsStateType = {
  isModalOpen: boolean;
  analysisText: string | null;
  openModal: () => void;
  closeModal: () => void;
  setAnalysisText: (s: string | null) => void;
};
