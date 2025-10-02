import { FC, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import {
  RouteNames,
  publicRoutes,
  privateRoutes,
} from "@/app/providers/router/config/route-config.ts";
import { Spinner } from "@/shared/ui/spinner.tsx";
import { Layout } from "@/app/layout/layout.tsx";
import { usePatientStore } from "@/entities/patient";

const AppRouter: FC = () => {
  const { selectedPatient, confirmed } = usePatientStore();

  const PrivateRoutes = () =>
    selectedPatient && confirmed ? (
      <Outlet />
    ) : (
      <Navigate to={RouteNames.MAIN} />
    );

  const PublicRoutes = () =>
    !selectedPatient || !confirmed ? (
      <Outlet />
    ) : (
      <Navigate to={RouteNames.DASHBOARD} />
    );

  return (
    <Suspense fallback={<Spinner size={"large"} fullScreen />}>
      <Routes>
        <Route element={<PrivateRoutes />}>
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Layout>
                  <route.component />
                </Layout>
              }
            />
          ))}
        </Route>

        <Route element={<PublicRoutes />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>

        <Route
          path={RouteNames.NAVIGATE}
          element={<Navigate replace to={RouteNames.MAIN} />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
