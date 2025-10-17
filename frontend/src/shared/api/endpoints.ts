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
  UPLOAD: {
    UPLOAD_PATIENTS: "/v1/upload/upload_patient_data",
    UPLOAD_PATIENTS_TO_SENSORS: "/v1/upload_to_sensors/upload_patient_data",
  },
};

export default Endpoints;
