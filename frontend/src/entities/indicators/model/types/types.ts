export type IndicatorsStateType = {
  isModalOpen: boolean;
  progress: number;
  isRunning: boolean;
  estimatedTime: number;
  elapsedTime: number;
  openModal: () => void;
  closeModal: () => void;
  startProgress: (duration: number) => void;
  updateProgress: (progress: number, elapsed: number) => void;
  resetProgress: () => void;
};
