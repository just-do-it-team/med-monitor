import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { Badge } from "@/shared/ui/badge.tsx";
import { useChartsStore } from "@/entities/chart";

export const PrognosisIndicatorsTable = () => {
  const { indicators } = useChartsStore();

  const indicatorsData = [
    {
      id: 1,
      name: "Базальный ритм",
      value: indicators.basalValue,
      status: indicators.basalStatus,
      comment: indicators.basalComment,
    },
    {
      id: 2,
      name: "Вариабельность",
      value: indicators.varValue,
      status: indicators.varStatus,
      comment: indicators.varComment,
    },
    {
      id: 3,
      name: "Акселерации",
      value: indicators.accsValue,
      status: indicators.accsStatus,
      comment: indicators.accsComment,
    },

    {
      id: 4,
      name: "Децелерации",
      value: indicators.decsValue,
      status: indicators.decsStatus,
      comment: indicators.decsComment,
    },
    {
      id: 5,
      name: "Активность матки",
      value: indicators.ucsValue,
      status: indicators.ucsStatus,
      comment: indicators.ucsComment,
    },
  ];

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge variant="default">Не определено</Badge>;

    switch (status && status.toLowerCase()) {
      case "нормальный":
        return <Badge variant="success">Нормальный</Badge>;
      case "подозрительный":
        return <Badge variant="warning">Подозрительный</Badge>;
      case "патологический":
        return <Badge variant="error">Патологический</Badge>;
      default:
        return <Badge variant="default">Не определено</Badge>;
    }
  };

  return (
    <div className="rounded-[10px] mt-[20px] border bg-white overflow-auto">
      <Table>
        <TableHeader className="bg-veryLightGray">
          <TableRow>
            <TableHead
              rowSpan={2}
              className="min-w-[160px] max-w-[160px] text-start align-start border-r"
            >
              <Typography size="sm" variant="span" weight="medium">
                Название
              </Typography>
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[113px] max-w-[113px] text-start align-start border-r"
            >
              <Typography size="sm" variant="span" weight="medium">
                Значение
              </Typography>
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[170px] max-w-[170px] text-start align-start border-r"
            >
              <Typography size="sm" variant="span" weight="medium">
                Статус
              </Typography>
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[209px] max-w-[209px] text-start align-start"
            >
              <Typography size="sm" variant="span" weight="medium">
                Комментарий
              </Typography>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[14px] font-light">
          {indicatorsData.map((indicator) => (
            <TableRow key={indicator.id}>
              <TableCell className="bg-white text-start border-r">
                {indicator.name}
              </TableCell>
              <TableCell className="bg-white text-start border-r">
                {(indicator.value && indicator.value !== 999) ||
                indicator.value === 0
                  ? indicator.value
                  : "—"}
              </TableCell>
              <TableCell className="bg-white text-start border-r">
                {indicator.status && indicator.status !== "Не определено"
                  ? getStatusBadge(indicator.status)
                  : getStatusBadge("")}
              </TableCell>
              <TableCell className="bg-white text-start border-r">
                {indicator.comment ? indicator.comment : "—"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow key={6}>
            <TableCell className="bg-veryLightGray text-start font-medium border-r">
              Состояние плода
            </TableCell>
            <TableCell className="bg-veryLightGray text-start"></TableCell>
            <TableCell className="bg-veryLightGray text-start">
              {indicators.overallStatus &&
              indicators.overallStatus !== "Не определено"
                ? getStatusBadge(indicators.overallStatus)
                : getStatusBadge("")}
            </TableCell>
            <TableCell className="bg-veryLightGray text-start"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
