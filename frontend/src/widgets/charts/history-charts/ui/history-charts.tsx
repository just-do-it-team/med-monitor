import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FhrChart } from "@/features/charts/fhr-chart";
import { UcChart } from "@/features/charts/uc-chart";
import { Typography } from "@/shared/ui/typography.tsx";
import { usePatientStore } from "@/entities/patient";
import { useHistoryStore } from "@/entities/history";
import { useHistoryChartQuery } from "@/entities/chart/model/services/services.ts";
import { useChartsStore } from "@/entities/chart";

export const HistoryCharts = () => {
  const [manualTime, setManualTime] = useState(30);

  const startTime = manualTime - 30;

  const { historyFhrData, historyUcData } = useChartsStore();
  const { selectedPatient } = usePatientStore();
  const { selectedHistory } = useHistoryStore();

  useHistoryChartQuery(selectedPatient!.id, selectedHistory!.id, startTime);

  const handleNavigateLeft = () => {
    setManualTime((prev) => Math.max(0, prev - 10));
  };

  const handleNavigateRight = () => {
    setManualTime((prev) => prev + 10);
  };

  return (
    <Card className="bg-veryLightGray rounded-px20">
      <CardContent>
        <div className="w-full flex justify-between">
          <div>
            <Typography weight="light">Выбранный диапазон</Typography>
            <Typography weight="semibold">
              {startTime} - {manualTime} минут
            </Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleNavigateLeft}
              disabled={manualTime <= 30}
            >
              <ChevronLeft className="w-5 h-5" />
              Назад на 10 минут
            </Button>
            <Button variant="outline" onClick={handleNavigateRight}>
              Вперед на 10 минут
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-[30px] gap-y-4">
          <FhrChart
            fhrData={historyFhrData}
            width={1600}
            height={400}
            duration={30}
            currentTime={manualTime}
          />
          <UcChart
            ucData={historyUcData}
            width={1600}
            height={300}
            duration={30}
            currentTime={manualTime}
          />
        </div>
      </CardContent>
    </Card>
  );
};
