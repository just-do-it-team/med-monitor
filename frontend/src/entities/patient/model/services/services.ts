import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import Endpoints from "@/shared/api/endpoints";
import {
  PatientType,
  PatientUploadType,
} from "@/entities/patient/model/types/types";
import { handleApiError } from "@/shared/api/api-error-handler";
import { toast } from "sonner";

export const usePatientsQuery = () =>
  useQuery<PatientType[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const response = await api.get(Endpoints.DASHBOARD.GET_PATIENTS);
        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить данные пациентов");
        throw e;
      }
    },
  });

export const usePatientUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, onProgress }: PatientUploadType) => {
      try {
        const formData = new FormData();
        formData.append("data", data);

        const response = await api.post(
          Endpoints.UPLOAD.UPLOAD_PATIENTS,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (event) => {
              if (event.total) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress?.(progress);
              }
            },
          },
        );

        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить файл пациентов");
        throw e;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Файл успешно загружен");
    },
  });
};

export const usePatientUploadToSensorsMutation = () => {
  return useMutation({
    mutationFn: async ({ data }: PatientUploadType) => {
      try {
        const formData = new FormData();
        formData.append("data", data);

        const response = await api.post(
          Endpoints.UPLOAD.UPLOAD_PATIENTS_TO_SENSORS,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        return response.data;
      } catch (e) {
        handleApiError(
          e,
          "Не удалось загрузить файл пациентов в модуль сенсоров",
        );
        throw e;
      }
    },
  });
};
