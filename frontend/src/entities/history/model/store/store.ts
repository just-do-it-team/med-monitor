import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HistoryStateType } from "@/entities/history/model/types/types.ts";

export const useHistoryStore = create<HistoryStateType>()(
  persist(
    (set) => ({
      sortField: null,
      sortDirection: null,
      tableData: {
        createDate: "",
        status: "",
        basal: null,
        variability: null,
        accels: null,
        decelsEarly: null,
        decelsLate: null,
        decelsVarGood: null,
        decelsVarBad: null,
      },
      currentPage: 1,
      pageSize: 10,
      selectedHistory: null,

      setSort: (field) =>
        set((state) => {
          if (state.sortField === field) {
            if (state.sortDirection === "asc") return { sortDirection: "desc" };
            if (state.sortDirection === "desc")
              return { sortField: null, sortDirection: null };
            return { sortDirection: "asc" };
          }
          return { sortField: field, sortDirection: "asc" };
        }),

      setTableData: (field, value) =>
        set((state) => ({
          tableData: { ...state.tableData, [field]: value },
        })),

      setPage: (page) => set({ currentPage: page }),

      setSelectedHistory: (selectedHistory) => set({ selectedHistory }),
    }),
    {
      name: "history-storage",
      partialize: (state) => ({
        selectedHistory: state.selectedHistory
          ? { id: state.selectedHistory.id }
          : null,
      }),
    },
  ),
);
