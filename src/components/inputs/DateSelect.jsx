"use client";
import { DAYS, MONTH } from "~/constants";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import SelectCustom from "./Select";

function DateSelect({ dataDate, onApply, disabled }) {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      day: "",
      month: "",
      year: "",
    },
    criteriaMode: "all",
  });

  // Generate year data
  const getYear = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startDate = currentYear - 100;
    for (let i = currentYear; i >= startDate; i--) {
      years.push({ id: i.toString(), label: i.toString() });
    }
    return years;
  };

  // Update form values when `dataDate` is provided
  useEffect(() => {
    if (dataDate) {
      const newData = new Date(dataDate);
      const day = newData.getDate().toString();
      const month = (newData.getMonth() + 1).toString();
      const year = newData.getFullYear().toString();
      setValue("day", day);
      setValue("month", "Tháng " + month);
      setValue("year", year);

      // Trigger `onApply` for the initial value
      onApply({ day, month, year });
    }
  }, [dataDate, setValue, onApply]);

  // Watch for changes in form values
  const selectedDate = watch(["day", "month", "year"]);

  useEffect(() => {
    const [day, month, year] = selectedDate;
    if (day && month && year) {
      onApply({ day, month, year });
    }
  }, [selectedDate, onApply]);

  return (
    <div className="w-full gap-x-3 flex items-center">
      <SelectCustom
        name="day"
        control={control}
        data={DAYS}
        valueField="label"
        keyField="id"
        placeholder="Ngày"
        disabled={disabled}
      />
      <SelectCustom
        name="month"
        control={control}
        data={MONTH}
        valueField="label"
        keyField="id"
        placeholder="Tháng"
        disabled={disabled}
      />
      <SelectCustom
        name="year"
        control={control}
        data={getYear()}
        valueField="label"
        keyField="id"
        placeholder="Năm"
        disabled={disabled}
      />
    </div>
  );
}

export default DateSelect;
