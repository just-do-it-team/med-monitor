import { useQuery } from "@tanstack/react-query";
import {
  HistoryItemType,
  HistoryTableResponseType,
} from "@/entities/history/model/types/types.ts";
import { api } from "@/shared/api/api.ts";
import Endpoints from "@/shared/api/endpoints.ts";
import { handleApiError } from "@/shared/api/api-error-handler.ts";

export const useHistoryQuery = (
  patientId: number,
  page: number,
  pageSize: number,
) =>
  useQuery<HistoryTableResponseType>({
    queryKey: ["employeesTable", patientId, page, pageSize],
    queryFn: async () => {
      try {
        const response = await api.get<HistoryTableResponseType>(
          `${Endpoints.HISTORY.GET_HISTORY}?patient_id=${patientId}&page=${page}&pagesize=${pageSize}`,
        );
        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить историю исследований");
        throw e;
      }
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });

export const useSelectedHistoryQuery = (patientId: number, historyId: number) =>
  useQuery<HistoryItemType>({
    queryKey: ["selectedHistoryItem"],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${Endpoints.HISTORY.GET_HISTORY}?patient_id=${patientId}&history_id=${historyId}`,
        );
        return response.data;
      } catch (e) {
        handleApiError(
          e,
          "Не удалось загрузить выбранную историю исследований",
        );
      }
    },
  });

export const useLastHistoryQuery = (patientId: number, options?: any) =>
  useQuery<HistoryItemType>({
    queryKey: ["lastHistoryItem", patientId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${Endpoints.HISTORY.GET_LAST_HISTORY}?patient_id=${patientId}`,
        );
        return response.data;
      } catch (e) {
        handleApiError(
          e,
          "Не удалось загрузить последнюю историю исследований",
        );
        throw e;
      }
    },
    enabled: false,
    ...options,
  });
