import { AnalyticsPage } from "@/pages/analytics-page";
import { HistoryPage } from "@/pages/history-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { MainPage } from "@/pages/main-page";

export enum RouteNames {
  MAIN = "/",
  DASHBOARD = "/dashboard",
  ANALYTICS = "/analytics/:id",
  HISTORY = "/history",
  NAVIGATE = "*",
}

export const routeMeta: Record<RouteNames, { title: string }> = {
  [RouteNames.MAIN]: { title: "Главная" },
  [RouteNames.DASHBOARD]: { title: "Дашборд" },
  [RouteNames.ANALYTICS]: { title: "Аналитика" },
  [RouteNames.HISTORY]: { title: "История исследований" },
  [RouteNames.NAVIGATE]: { title: "Не найдено" },
};

export const publicRoutes = [{ path: RouteNames.MAIN, component: MainPage }];

export const privateRoutes = [
  { path: RouteNames.DASHBOARD, component: DashboardPage },
  { path: RouteNames.ANALYTICS, component: AnalyticsPage },
  { path: RouteNames.HISTORY, component: HistoryPage },
];
