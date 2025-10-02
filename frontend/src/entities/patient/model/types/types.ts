export type PatientType = {
  id: number;
  fullName: string;
  type: string;
  folderId: number;
  birthDate: string;
  diagnosis: string;
};

export type PatientStateType = {
  confirmed: boolean;
  selectedPatient: PatientType | null;
  setSelectedPatient: (patient: PatientType) => void;
  clearSelectedPatient: () => void;
  confirm: (value: boolean) => void;
};
