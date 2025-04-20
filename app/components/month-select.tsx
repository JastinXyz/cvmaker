import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import type { AvailableLanguage } from "~/types";

type MonthSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

const months = (locale: AvailableLanguage) => {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString(locale, { month: "short" })
  ).map((label, i) => ({
    label,
    value: label.toLowerCase(),
    key: i,
  }));
}

const MonthSelect: React.FC<MonthSelectProps> = ({
  value,
  onChange,
  label,
  placeholder = t('general.select_month_label'),
}) => {
  let { i18n } = useTranslation();

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {months(i18n.language as AvailableLanguage).map(({ label, value, key }) => (
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

export default MonthSelect;
