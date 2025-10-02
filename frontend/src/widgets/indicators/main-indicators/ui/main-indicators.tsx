import { useChartsStore } from "@/entities/chart/model/store/store.ts";
import { MainIndicatorsCard } from "@/features/indicators/main-indicators-card";

export const MainIndicators = () => {
  const { latestIndicators } = useChartsStore();

  const chartIndicatorsData = [
    {
      id: 1,
      title: "Текущая ЧСС плода",
      value: latestIndicators.fhr,
      measurement: "уд/мин",
    },
    {
      id: 2,
      title: "Базальный ритм",
      value: latestIndicators.basal,
      measurement: "уд/мин",
    },
    {
      id: 3,
      title: "Вариабельность",
      value: latestIndicators.var,
      measurement: "уд/мин",
    },
    {
      id: 4,
      title: "Активность матки",
      value: latestIndicators.ucs,
      measurement: "раз / 10 мин",
    },
    {
      id: 5,
      title: "Децелерации",
      value: latestIndicators.decs,
      measurement: "раз / 10 мин",
    },
    {
      id: 6,
      title: "Акцелерации",
      value: latestIndicators.accs,
      measurement: "раз / 10 мин",
    },
  ];

  return (
    <div className="flex flex-row flex-wrap justify-between gap-[20px] w-full">
      {chartIndicatorsData.map((indicator) => (
        <MainIndicatorsCard key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
};
