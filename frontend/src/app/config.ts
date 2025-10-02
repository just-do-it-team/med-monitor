export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://78.36.74.22:8000"
    : "https://med-monitor-justdoit.ru";

export const SERVER_WS_URL =
  process.env.NODE_ENV === "development"
    ? "ws://78.36.74.22:8000"
    : "wss://med-monitor-justdoit.ru";
