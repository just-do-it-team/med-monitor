import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { useEffect } from "react";
import {
  formattedDate,
  formattedDateShort,
} from "@/shared/config/date/format-date.ts";
import { useAnalyticsStore } from "@/entities/analytics";
import { usePatientStore } from "@/entities/patient";
import { useHistoryStore } from "@/entities/history";
import { useSelectedHistoryQuery } from "@/entities/history/model/services/services.ts";

export const AnalyticsInfoCard = () => {
  const { openModal, setAnalysisText, analysisText } = useAnalyticsStore();
  const { selectedPatient } = usePatientStore();
  const { selectedHistory } = useHistoryStore();
  const { data, isLoading } = useSelectedHistoryQuery(
    selectedPatient!.id,
    selectedHistory!.id,
  );

  useEffect(() => {
    setAnalysisText(null);
  }, []);

  const handleAnalysisStart = () => {
    openModal();
  };

  return (
    <div className="flex gap-[20px] w-full">
      <Card className="bg-veryLightGray rounded-px20 min-w-[381px]">
        <CardContent className="flex flex-col justify-between gap-4">
          <div className="flex">
            <div className="flex flex-col min-w-[155px]">
              <Typography variant="p" weight="light" className="text-lightGray">
                Дата
              </Typography>
              <Typography>
                {data?.createDate && !isLoading
                  ? formattedDate(data?.createDate)
                  : "—"}
              </Typography>
            </div>
            <div className="flex flex-col min-w-[155px]">
              <Typography variant="p" weight="light" className="text-lightGray">
                Время
              </Typography>
              <Typography>
                {data?.createDate && !isLoading
                  ? formattedDateShort(data?.createDate)
                  : "—"}
              </Typography>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col min-w-[155px]">
              <Typography variant="p" weight="light" className="text-lightGray">
                Валидация
              </Typography>
              <Typography>
                {data?.valid ? "Да" : isLoading ? "—" : "Нет"}
              </Typography>
            </div>
            <div className="flex flex-col min-w-[155px]">
              <Typography variant="p" weight="light" className="text-lightGray">
                Состояние
              </Typography>
              <Typography>
                {data?.status && !isLoading ? data?.status : "—"}
              </Typography>
            </div>
          </div>
          <Button
            variant="primary"
            className="flex w-full mt-[16px]"
            onClick={handleAnalysisStart}
          >
            Начать анализ
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-veryLightGray rounded-px20 w-full">
        <CardContent className="flex flex-col justify-between gap-4">
          <Typography size="lg">Итоги анализа</Typography>
          <Typography weight="light" className=" max-h-[145px] overflow-y-auto">
            {data?.analysis
              ? data?.analysis
              : analysisText
                ? analysisText
                : "—"}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
