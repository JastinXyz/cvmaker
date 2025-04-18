import React, { useMemo } from "react";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";

type YearSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  range?: number; 
  fromYear?: number; 
};

const YearSelect: React.FC<YearSelectProps> = ({
  value,
  onChange,
  label = "Year",
  placeholder = "Select a year",
  range = 56,
  fromYear,
}) => {
  const years = useMemo(() => {
    const base = fromYear ?? new Date().getFullYear();
    return Array.from({ length: range }, (_, i) => {
      const year = base - i;
      return { label: year.toString(), value: year.toString(), key: year };
    });
  }, [range, fromYear]);

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {years.map(({ label, value, key }) => (
              <SelectItem key={key} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelect;
