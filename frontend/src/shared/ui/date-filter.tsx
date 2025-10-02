import { useEffect, useId, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/ui/calendar.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Button } from "@/shared/ui/button.tsx";

interface DateFilterProps {
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  value,
  onChange,
  placeholder = "Выберите дату",
}) => {
  const id = useId();
  const [month, setMonth] = useState(new Date());
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );

  const handleDayPickerSelect = (day: Date | undefined) => {
    if (!day) {
      onChange("");
      setDate(undefined);
    } else {
      const formatted = format(day, "yyyy-MM-dd");
      onChange(formatted);
      setDate(day);
      setMonth(day);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val) {
      const parsed = new Date(val);
      setDate(parsed);
      setMonth(parsed);
    } else {
      setDate(undefined);
    }
  };

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      setDate(parsed);
      setMonth(parsed);
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleReset = () => {
    onChange("");
    setDate(undefined);
  };

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDayPickerSelect}
        month={month}
        onMonthChange={setMonth}
      />
      <div className="border-t p-3 space-y-3">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="text-sm font-light">
            {placeholder}
          </Label>
          <div className="relative grow">
            <Input
              id={id}
              type="date"
              value={value || ""}
              onChange={handleInputChange}
              className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              aria-label="Select date"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <CalendarIcon size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
          onClick={handleReset}
          disabled={!value}
        >
          Сбросить
        </Button>
      </div>
    </>
  );
};
