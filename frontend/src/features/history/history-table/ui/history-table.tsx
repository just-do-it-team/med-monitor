import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Spinner } from "@/shared/ui/spinner";
import { CalendarDays } from "lucide-react";
import { SortButton } from "@/shared/ui/sort-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { sortTableData } from "@/shared/config/table/table-sorting";
import { filterTableData } from "@/shared/config/table/table-filtering";
import { Pagination } from "@/shared/ui/pagination";
import { useHistoryStore } from "@/entities/history";
import { useHistoryQuery } from "@/entities/history/model/services/services.ts";
import { usePatientStore } from "@/entities/patient";
import { Badge } from "@/shared/ui/badge.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { formattedDate } from "@/shared/config/date/format-date.ts";
import { Typography } from "@/shared/ui/typography.tsx";
import { Link } from "react-router-dom";
import { DateFilter } from "@/shared/ui/date-filter.tsx";

export function HistoryTable() {
  const {
    sortField,
    sortDirection,
    tableData,
    currentPage,
    pageSize,
    setSort,
    setTableData,
    setPage,
  } = useHistoryStore();

  const { selectedPatient } = usePatientStore();
  const { setSelectedHistory } = useHistoryStore();

  const { data, isLoading, isError } = useHistoryQuery(
    selectedPatient!.id,
    currentPage,
    pageSize,
  );

  const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

  const processedItems = (() => {
    if (!data?.items) return [];
    const filtered = filterTableData(data.items, tableData);
    return sortTableData(filtered, sortField, sortDirection);
  })();

  const renderColumnHeader = (
    field: keyof typeof tableData,
    label: string,
    isSortable: boolean,
    isFilterable: boolean,
  ) => (
    <div className="flex justify-center items-center">
      <Typography size="sm" variant="span" weight="medium">
        {label}
      </Typography>
      {isSortable && (
        <SortButton
          direction={sortField === field ? sortDirection : null}
          onClick={() => setSort(field)}
        />
      )}
      {isFilterable && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`p-1 rounded-md hover:bg-gray-100 ${
                tableData[field] ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <CalendarDays size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 rounded-px20 w-full">
            <DateFilter
              value={tableData[field]}
              onChange={(value) => setTableData(field, value)}
              placeholder="Дата"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );

  const getStatusBadge = (status: string) => {
    if (!status) return "—";

    switch (status && status.toLowerCase()) {
      case "нормальное":
        return <Badge variant="success">Нормальное</Badge>;
      case "подозрительное":
        return <Badge variant="warning">Подозрительное</Badge>;
      case "патологическое":
        return <Badge variant="error">Патологическое</Badge>;
      default:
        return "—";
    }
  };

  const getValidationText = (valid: boolean) => {
    return valid ? "Да" : "нет";
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-[10px] border bg-white overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                {renderColumnHeader("createDate", "Дата", true, true)}
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                <Typography size="sm" variant="span" weight="medium">
                  Валидация
                </Typography>
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                <Typography size="sm" variant="span" weight="medium">
                  Состояние
                </Typography>
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                {renderColumnHeader("basal", "Базальная ЧСС", false, false)}
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                {renderColumnHeader(
                  "variability",
                  "Вариабельность ЧСС",
                  false,
                  false,
                )}
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                <div className="flex flex-col">
                  <Typography size="sm" variant="span" weight="medium">
                    Акселерации
                  </Typography>
                  <Typography
                    size="sm"
                    variant="span"
                    weight="light"
                    className="text-graySecondary"
                  >
                    (раз / 10 мин)
                  </Typography>
                </div>
              </TableHead>
              <TableHead colSpan={4} className="text-center border-r">
                <Typography size="sm" variant="span" weight="medium">
                  Децелерации
                </Typography>
                <Typography
                  size="sm"
                  variant="span"
                  weight="light"
                  className="text-graySecondary ml-1"
                >
                  (раз / 10 мин)
                </Typography>
              </TableHead>
              <TableHead
                rowSpan={2}
                className="text-center align-middle border-r"
              >
                <Typography size="sm" variant="span" weight="medium">
                  Результаты анализа
                </Typography>
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle">
                <div className="flex items-center gap-2">
                  <Typography size="sm" weight="light" variant="span">
                    {""}
                  </Typography>
                </div>
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center border-r">
                {renderColumnHeader("decelsEarly", "Ранние", false, false)}
              </TableHead>
              <TableHead className="text-center border-r">
                {renderColumnHeader("decelsLate", "Поздние", false, false)}
              </TableHead>
              <TableHead className="text-center border-r">
                {renderColumnHeader(
                  "decelsVarGood",
                  "Вариабельные хорошие",
                  false,
                  false,
                )}
              </TableHead>
              <TableHead className="text-center border-r">
                {renderColumnHeader(
                  "decelsVarBad",
                  "Вариабельные плохие",
                  false,
                  false,
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[14px] font-light">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner />
                    <Typography size="sm" variant="span" weight="light">
                      Загрузка...
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Ошибка загрузки данных
                </TableCell>
              </TableRow>
            ) : processedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              processedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center border-r">
                    {formattedDate(item.createDate) || "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {getValidationText(item.valid)}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.basal !== 999 ? item.basal : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.variability !== 999 ? item.variability : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.accels !== 999 ? item.accels : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.decelsEarly !== 999 ? item.decelsEarly : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.decelsLate !== 999 ? item.decelsLate : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.decelsVarGood !== 999 ? item.decelsVarGood : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    {item.decelsVarBad !== 999 ? item.decelsVarBad : "—"}
                  </TableCell>
                  <TableCell className="text-start border-r">
                    {item.analysis ? item.analysis : "—"}
                  </TableCell>
                  <TableCell className="text-center border-r">
                    <Link to={`/analytics/${item.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedHistory(item)}
                      >
                        <Typography
                          size="sm"
                          variant="span"
                          weight="medium"
                          className="text-darkBlue"
                        >
                          Подробнее
                        </Typography>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && !isError && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
