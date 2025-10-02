import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api.ts";
import Endpoints from "@/shared/api/endpoints.ts";
import { DoctorType } from "@/entities/doctor/model/types/types.ts";
import { handleApiError } from "@/shared/api/api-error-handler.ts";

export const useDoctorsQuery = () =>
  useQuery<DoctorType[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const response = await api.get(Endpoints.DASHBOARD.GET_DOCTORS);
        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить врачей");
      }
    },
  });
