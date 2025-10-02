import { create } from "zustand";
import { CommonStateType } from "@/entities/common/model/types/types.ts";

export const useCommonStore = create<CommonStateType>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
