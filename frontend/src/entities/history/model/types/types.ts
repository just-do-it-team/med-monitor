import { SortDirection } from "@/shared/config/table/table-sorting.ts";

export type HistoryItemType = {
  id: number;
  patientId: number;
  createDate: string;
  valid: boolean;
  status: string;
  basal: number | null;
  variability: number | null;
  accels: number | null;
  decelsEarly: number | null;
  decelsLate: number | null;
  decelsVarGood: number | null;
  decelsVarBad: number | null;
  analysis: string;
};

export type HistoryTableResponseType = {
  items: HistoryItemType[];
  total: number;
};

export type HistoryTableFilters = {
  createDate: string;
  status: string;
  basal: number | null;
  variability: number | null;
  accels: number | null;
  decelsEarly: number | null;
  decelsLate: number | null;
  decelsVarGood: number | null;
  decelsVarBad: number | null;
};

export type HistoryStateType = {
  sortField: string | null;
  sortDirection: SortDirection;
  tableData: HistoryTableFilters;
  currentPage: number;
  pageSize: number;
  selectedHistory: HistoryItemType | null;
  setSelectedHistory: (history: HistoryItemType | null) => void;
  setSort: (field: string) => void;
  setTableData: (field: keyof HistoryTableFilters, value: string) => void;
  setPage: (page: number) => void;
};
