import { RealTimeCharts } from "@/widgets/charts/real-time-charts";
import { MainIndicators } from "@/widgets/indicators/main-indicators";
import { PrognosisIndicators } from "@/widgets/indicators/prognosis-indicators";
import { useEffect } from "react";
import { useHistoryStore } from "@/entities/history";
import { useChartsStore } from "@/entities/chart";

const DashboardPage = () => {
  const { setSelectedHistory } = useHistoryStore();
  const { reset } = useChartsStore();

  useEffect(() => {
    reset();
    setSelectedHistory(null);
  }, []);

  return (
    <>
      <div className="flex gap-[20px] w-full">
        <div className="flex flex-col min-w-[999px]">
          <RealTimeCharts />
        </div>
        <div className="flex flex-col w-full">
          <MainIndicators />
          <PrognosisIndicators />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
