export type DoctorType = {
  id: number;
  fullName: string;
};

export type DoctorStateType = {
  selectedDoctor: DoctorType | null;
  setSelectedDoctor: (patient: DoctorType) => void;
  clearSelectedDoctor: () => void;
};
