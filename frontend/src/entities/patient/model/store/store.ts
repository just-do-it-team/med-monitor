import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PatientStateType } from "@/entities/patient/model/types/types.ts";

export const usePatientStore = create<PatientStateType>()(
  persist(
    (set) => ({
      confirmed: false,
      selectedPatient: null,
      setSelectedPatient: (selectedPatient) => set({ selectedPatient }),
      clearSelectedPatient: () => set({ selectedPatient: null }),
      confirm: (value) => set({ confirmed: value }),
    }),
    {
      name: "patient-storage",
    },
  ),
);
