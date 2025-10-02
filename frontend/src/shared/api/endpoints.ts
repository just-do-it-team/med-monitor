const Endpoints = {
  DASHBOARD: {
    GET_PATIENTS: "/v1/dashboard/get_patients",
    GET_DOCTORS: "/v1/dashboard/get_doctors",
  },
  HISTORY: {
    GET_LAST_HISTORY: "/v1/history/get_last_id",
    GET_HISTORY: "/v1/history/get_history",
    GET_CHARTS: "/v1/history/load_ctg",
  },
  ANALYTICS: {
    GET_ANALYSIS: "/v1/analysis/start_analysis",
  },
};

export default Endpoints;
