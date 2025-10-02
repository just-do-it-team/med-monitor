import { create } from "zustand";
import { ChartsState } from "@/entities/chart/model/types/types.ts";

export const useChartsStore = create<ChartsState>((set) => ({
  historyFhrData: [],
  historyUcData: [],
  fhrData: [],
  ucData: [],
  currentTime: 0,
  socketConnected: false,
  latestIndicators: {
    fhr: null,
    uc: null,
    basal: null,
    var: null,
    ucs: null,
    decs: null,
    accs: null,
  },
  indicators: {
    basalValue: null,
    basalStatus: null,
    basalComment: null,
    varValue: null,
    varStatus: null,
    varComment: null,
    ucsValue: null,
    ucsStatus: null,
    ucsComment: null,
    decsValue: null,
    decsStatus: null,
    decsComment: null,
    accsValue: null,
    accsStatus: null,
    accsComment: null,
    overallStatus: null,
  },

  appendHistoryFhr: (point) =>
    set((state) => ({
      historyFhrData: [...state.historyFhrData, point],
    })),

  appendHistoryUc: (point) =>
    set((state) => ({
      historyUcData: [...state.historyUcData, point],
    })),

  setHistoryFhrData: (points) => set({ historyFhrData: points }),
  setHistoryUcData: (points) => set({ historyUcData: points }),

  appendFhr: (point) =>
    set((state) => {
      const updated = [...state.fhrData, point];
      return {
        fhrData: updated.length > 1800 ? updated.slice(-1800) : updated,
      };
    }),

  appendUc: (point) =>
    set((state) => {
      const updated = [...state.ucData, point];
      return { ucData: updated.length > 1800 ? updated.slice(-1800) : updated };
    }),

  setCurrentTime: (t) => set({ currentTime: t }),

  setSocketConnected: (v) => set({ socketConnected: v }),

  setLatestIndicators: (data) =>
    set((state) => ({
      latestIndicators: { ...state.latestIndicators, ...data },
    })),

  setIndicators: (data) =>
    set((state) => ({
      indicators: { ...state.indicators, ...data },
    })),

  reset: () =>
    set({
      historyFhrData: [],
      historyUcData: [],
      fhrData: [],
      ucData: [],
      currentTime: 0,
      latestIndicators: {
        fhr: null,
        uc: null,
        basal: null,
        var: null,
        ucs: null,
        decs: null,
        accs: null,
      },
      indicators: {
        basalValue: null,
        basalStatus: null,
        basalComment: null,
        varValue: null,
        varStatus: null,
        varComment: null,
        ucsValue: null,
        ucsStatus: null,
        ucsComment: null,
        decsValue: null,
        decsStatus: null,
        decsComment: null,
        accsValue: null,
        accsStatus: null,
        accsComment: null,
        overallStatus: null,
      },
    }),
}));
