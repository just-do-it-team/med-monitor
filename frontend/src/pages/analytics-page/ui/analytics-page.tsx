import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { RouteNames } from "@/app/providers/router/config/route-config.ts";
import { AnalyticsModal } from "@/features/analytics/analytics-modal";
import { ChevronLeft } from "lucide-react";
import { HistoryCharts } from "@/widgets/charts/history-charts";
import { AnalyticsInfoCard } from "@/features/analytics/analytics-info-card";

const AnalyticsPage = () => {
  return (
    <>
      <Link to={RouteNames.HISTORY}>
        <Button variant="secondary" size="sm" className="text-darkBlue">
          <ChevronLeft />
          <Typography size="lg" variant="span" className="text-darkBlue">
            Назад к истории
          </Typography>
        </Button>
      </Link>
      <div className="flex gap-[20px] flex-col mt-[20px] ">
        <AnalyticsInfoCard />
        <HistoryCharts />
      </div>

      <AnalyticsModal />
    </>
  );
};

export default AnalyticsPage;
