import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DoctorStateType } from "@/entities/doctor/model/types/types.ts";

export const useDoctorStore = create<DoctorStateType>()(
  persist(
    (set) => ({
      selectedDoctor: null,
      setSelectedDoctor: (selectedDoctor) => set({ selectedDoctor }),
      clearSelectedDoctor: () => set({ selectedDoctor: null }),
    }),
    {
      name: "doctor-storage",
    },
  ),
);
