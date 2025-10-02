import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api.ts";
import Endpoints from "@/shared/api/endpoints.ts";
import { handleApiError } from "@/shared/api/api-error-handler.ts";
import { AnalysisType } from "@/entities/analytics/model/types/types.ts";

export const useAnalysisQuery = (patientId: number, historyId: number) =>
  useQuery<AnalysisType>({
    queryKey: ["analysis", patientId, historyId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${Endpoints.ANALYTICS.GET_ANALYSIS}?patient_id=${patientId}&history_id=${historyId}`,
        );
        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить аналитику");
        throw e;
      }
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });
