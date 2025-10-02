export type ChartIndicatorsType = {
  id: number;
  title: string;
  value: number | null;
  measurement: string;
};

export type ChartDataType = {
  time: number;
  value: number;
};

export type DashboardChartsDataType = {
  time: number;
  fhr: number;
  uc: number;
  basal: number;
  var: number;
  ucs: number;
  decs: number;
  accs: number;
};

export type PrognosisIndicatorsDataType = {
  basalValue: number;
  basalStatus: string;
  basalComment: string;
  varValue: number;
  varStatus: string;
  varComment: string;
  ucsValue: number;
  ucsStatus: string;
  ucsComment: string;
  decsValue: number;
  decsStatus: string;
  decsComment: string;
  accsValue: number;
  accsStatus: string;
  accsComment: string;
  overallStatus: string;
};

export type HistoryChartsDataType = {
  time: number;
  fhr: number;
  uc: number;
};

export type ChartsState = {
  historyFhrData: ChartDataType[];
  historyUcData: ChartDataType[];
  fhrData: ChartDataType[];
  ucData: ChartDataType[];

  lastHistoryLoading: boolean;

  currentTime: number;
  socketConnected: boolean;

  latestIndicators: {
    fhr: number | null;
    uc: number | null;
    basal: number | null;
    var: number | null;
    ucs: number | null;
    decs: number | null;
    accs: number | null;
  };

  indicators: {
    basalValue: number | null;
    basalStatus: string | null;
    basalComment: string | null;
    varValue: number | null;
    varStatus: string | null;
    varComment: string | null;
    ucsValue: number | null;
    ucsStatus: string | null;
    ucsComment: string | null;
    decsValue: number | null;
    decsStatus: string | null;
    decsComment: string | null;
    accsValue: number | null;
    accsStatus: string | null;
    accsComment: string | null;
    overallStatus: string | null;
  };

  appendHistoryFhr: (point: ChartDataType) => void;
  appendHistoryUc: (point: ChartDataType) => void;

  appendFhr: (point: ChartDataType) => void;
  appendUc: (point: ChartDataType) => void;

  setHistoryFhrData: (points: ChartDataType[]) => void;
  setHistoryUcData: (points: ChartDataType[]) => void;

  setCurrentTime: (t: number) => void;

  setLastHistoryLoading: (l: boolean) => void;

  setSocketConnected: (v: boolean) => void;

  setLatestIndicators: (data: Partial<ChartsState["latestIndicators"]>) => void;
  setIndicators: (data: Partial<ChartsState["indicators"]>) => void;
  reset: () => void;
};
