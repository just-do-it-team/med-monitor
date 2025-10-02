import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { FC } from "react";
import { ChartIndicatorsType } from "@/entities/chart";

interface MainIndicatorsCardProps {
  indicator: ChartIndicatorsType;
}

export const MainIndicatorsCard: FC<MainIndicatorsCardProps> = ({
  indicator,
}: MainIndicatorsCardProps) => {
  return (
    <Card className={"bg-veryLightGray w-full max-w-[335px] rounded-px20"}>
      <CardContent className="flex justify-between items-center w-full">
        <Typography
          size="lg"
          variant="p"
          className="max-w-[150px] text-darkGray leading-[1.2]"
        >
          {indicator.title}
        </Typography>
        <div className="flex flex-col items-end leading-[1]">
          <Typography variant="span" size="xl3" className="text-darkBlue m-0">
            {indicator.value !== null && indicator.value !== 999
              ? Math.round(indicator.value)
              : "—"}
          </Typography>
          <Typography
            size="sm"
            weight="light"
            variant="span"
            className="text-gray m-0"
          >
            {indicator.measurement}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
