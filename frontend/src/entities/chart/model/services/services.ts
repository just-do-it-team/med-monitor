import { useEffect, useRef } from "react";
import {
  DashboardChartsDataType,
  HistoryChartsDataType,
  PrognosisIndicatorsDataType,
} from "@/entities/chart/model/types/types.ts";
import { usePatientStore } from "@/entities/patient";
import { useChartsStore } from "@/entities/chart/model/store/store.ts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api.ts";
import Endpoints from "@/shared/api/endpoints.ts";
import { handleApiError } from "@/shared/api/api-error-handler.ts";
import { SERVER_WS_URL } from "@/app/config.ts";

export const useChartsSocket = (isRealTime: boolean) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { selectedPatient } = usePatientStore();

  const appendFhr = useChartsStore((s) => s.appendFhr);
  const appendUc = useChartsStore((s) => s.appendUc);
  const setCurrentTime = useChartsStore((s) => s.setCurrentTime);
  const setLatest = useChartsStore((s) => s.setLatestIndicators);
  const reset = useChartsStore((s) => s.reset);
  const setSocketConnected = useChartsStore((s) => s.setSocketConnected);

  useEffect(() => {
    if (!isRealTime || !selectedPatient) return;

    const url = `${SERVER_WS_URL}/v1/dashboard/wss/to_chart/${selectedPatient.type}/${selectedPatient.folderId}/${selectedPatient.id}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      // console.log("WebSocket подключен:", url);
      setSocketConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data: DashboardChartsDataType = JSON.parse(event.data);
        setCurrentTime(data.time);
        appendFhr({ time: data.time, value: data.fhr });
        appendUc({ time: data.time, value: data.uc });
        setLatest({
          fhr: data.fhr,
          uc: data.uc,
          basal: data.basal,
          var: data.var,
          ucs: data.ucs,
          decs: data.decs,
          accs: data.accs,
        });
      } catch (err) {
        console.error("Ошибка обработки WebSocket:", err);
      }
    };

    socket.onclose = () => {
      // console.log("WebSocket закрыт");
      setSocketConnected(false);
      socketRef.current = null;
    };

    socket.onerror = (err) => {
      console.error("Ошибка WebSocket", err);
      setSocketConnected(false);
    };

    return () => {
      socket.close();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [
    isRealTime,
    selectedPatient?.id,
    selectedPatient?.folderId,
    selectedPatient?.type,
  ]);

  return { socketRef, reset };
};

export const useIndicatorsSocket = (isRealTime: boolean) => {
  const indicatorsSocketRef = useRef<WebSocket | null>(null);
  const { selectedPatient } = usePatientStore();

  const setIndicators = useChartsStore((s) => s.setIndicators);

  useEffect(() => {
    if (!isRealTime || !selectedPatient) return;

    const url = `${SERVER_WS_URL}/v1/dashboard/wss/to_status`;
    const socket = new WebSocket(url);
    indicatorsSocketRef.current = socket;

    socket.onopen = () => {
      // console.log("WebSocket подключен:", url);
    };

    socket.onmessage = (event) => {
      try {
        const data: PrognosisIndicatorsDataType = JSON.parse(event.data);

        setIndicators({
          basalValue: data.basalValue,
          basalStatus: data.basalStatus,
          basalComment: data.basalComment,
          varValue: data.varValue,
          varStatus: data.varStatus,
          varComment: data.varComment,
          ucsValue: data.ucsValue,
          ucsStatus: data.ucsStatus,
          ucsComment: data.ucsComment,
          decsValue: data.decsValue,
          decsStatus: data.decsStatus,
          decsComment: data.decsComment,
          accsValue: data.accsValue,
          accsStatus: data.accsStatus,
          accsComment: data.accsComment,
        });
      } catch (err) {
        console.error("Ошибка обработки WebSocket:", err);
      }
    };

    socket.onclose = () => {
      // console.log("WebSocket закрыт");
      indicatorsSocketRef.current = null;
    };

    socket.onerror = (err) => {
      console.error("Ошибка WebSocket", err);
    };

    return () => {
      socket.close();
      indicatorsSocketRef.current = null;
    };
  }, [
    isRealTime,
    selectedPatient?.id,
    selectedPatient?.folderId,
    selectedPatient?.type,
  ]);

  return { indicatorsSocketRef };
};

export const useHistoryChartQuery = (
  patientId: number,
  historyId: number,
  startTime: number,
) => {
  const setHistoryFhrData = useChartsStore((s) => s.setHistoryFhrData);
  const setHistoryUcData = useChartsStore((s) => s.setHistoryUcData);

  return useQuery<HistoryChartsDataType[]>({
    queryKey: ["historyChartQuery", patientId, historyId, startTime],
    queryFn: async () => {
      try {
        const response = await api.get(
          `${Endpoints.HISTORY.GET_CHARTS}?patient_id=${patientId}&history_id=${historyId}&start_point=${startTime}`,
        );

        const fhrData = response.data.map((item: HistoryChartsDataType) => ({
          time: item.time,
          value: item.fhr,
          fl: item.fl,
        }));
        const ucData = response.data.map((item: HistoryChartsDataType) => ({
          time: item.time,
          value: item.uc,
          fl: item.fl,
        }));

        setHistoryFhrData(fhrData);
        setHistoryUcData(ucData);

        return response.data;
      } catch (e) {
        handleApiError(e, "Не удалось загрузить данные графиков");
        return [];
      }
    },
  });
};
