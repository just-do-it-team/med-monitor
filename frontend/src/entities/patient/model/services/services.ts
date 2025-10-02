import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api.ts";
import Endpoints from "@/shared/api/endpoints.ts";
import { PatientType } from "@/entities/patient/model/types/types.ts";
import { handleApiError } from "@/shared/api/api-error-handler.ts";

export const usePatientsQuery = () =>
  useQuery<PatientType[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const response = await api.get(Endpoints.DASHBOARD.GET_PATIENTS);
        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить данные пациентов");
      }
    },
  });
