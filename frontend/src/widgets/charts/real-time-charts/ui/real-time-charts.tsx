import { Typography } from "@/shared/ui/typography.tsx";
import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Play, Square } from "lucide-react";
import { Button } from "@/shared/ui/button.tsx";
import { useChartsSocket, useChartsStore } from "@/entities/chart";
import { timer } from "@/shared/config/date/timer.ts";
import { FhrChart } from "@/features/charts/fhr-chart";
import { UcChart } from "@/features/charts/uc-chart";
import { useIndicatorsSocket } from "@/entities/chart/model/services/services.ts";
import { useLastHistoryQuery } from "@/entities/history/model/services/services.ts";
import { usePatientStore } from "@/entities/patient";
import { useState } from "react";
import { useHistoryStore } from "@/entities/history";

export const RealTimeCharts = () => {
  const [isRealTime, setIsRealTime] = useState(false);

  const { setSelectedHistory } = useHistoryStore();
  const { fhrData, ucData, currentTime } = useChartsStore();
  const { selectedPatient } = usePatientStore();

  const { data, refetch } = useLastHistoryQuery(selectedPatient!.id, {
    enabled: true,
  });

  const { reset, socketRef } = useChartsSocket(isRealTime);
  const { indicatorsSocketRef } = useIndicatorsSocket(isRealTime);

  const toggleRealTime = () => {
    if (isRealTime) {
      setIsRealTime(false);
      socketRef.current?.close();
      indicatorsSocketRef.current?.close();
    } else {
      reset();
      setIsRealTime(true);
      refetch();
      setSelectedHistory(data);
    }
  };

  return (
    <Card className="bg-veryLightGray rounded-px20">
      <CardContent>
        <div className="flex justify-between gap-x-[28px]">
          <div className="flex flex-col min-w-[125px]">
            <Typography size="sm" weight="light" className="text-darkGray">
              Прошло времени:
            </Typography>
            <Typography size="lg" variant="p" weight="medium">
              {timer(currentTime)}
            </Typography>
          </div>

          <Button
            variant={isRealTime ? "outline" : "primary"}
            onClick={toggleRealTime}
            className="flex gap-1 w-full"
          >
            {isRealTime ? <Square /> : <Play />}
            {isRealTime ? "Завершить" : "Начать"}
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center mt-[30px]">
          <FhrChart
            fhrData={fhrData}
            width={950}
            height={350}
            duration={20}
            currentTime={currentTime}
          />
          <UcChart
            ucData={ucData}
            width={950}
            height={250}
            duration={20}
            currentTime={currentTime}
          />
        </div>
      </CardContent>
    </Card>
  );
};
