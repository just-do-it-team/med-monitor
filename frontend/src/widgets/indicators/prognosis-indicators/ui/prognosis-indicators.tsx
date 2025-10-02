import { Typography } from "@/shared/ui/typography.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { Link } from "react-router-dom";
import { PrognosisIndicatorsTable } from "@/features/indicators/prognosis-indicators-table";
import { useHistoryStore } from "@/entities/history";
import { useChartsStore } from "@/entities/chart";

export const PrognosisIndicators = () => {
  const { selectedHistory } = useHistoryStore();
  const socketConnected = useChartsStore((s) => s.socketConnected);

  return (
    <>
      <div className="w-full flex items-center justify-between mt-[40px]">
        <Typography size="xl" variant="p" weight="medium">
          Показатели
        </Typography>

        <Button disabled={!selectedHistory?.id || socketConnected}>
          <Link to={`/analytics/${selectedHistory?.id}`}>Начать анализ</Link>
        </Button>
      </div>
      <PrognosisIndicatorsTable />
    </>
  );
};
