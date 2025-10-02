import { PatientType } from "./model/types/types.ts";
import { usePatientsQuery } from "./model/services/services.ts";
import { usePatientStore } from "./model/store/store.ts";

export { usePatientStore, usePatientsQuery };
export type { PatientType };
