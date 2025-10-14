import { getTomorrow as getTomorrowJsDate } from "./getTomorrow";
import { useState, useImperativeHandle, useEffect } from "react";
import { getTomorrowIsoDate } from "@/utils/date/getTomorrowIsoDate";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { convertJsDate2IsoDate } from "@/utils/date/convertJsDate2IsoDate";

export const useDeliveryDatePicker = ({ onChange, ref, defaultValue }: any) => {
  const [selected, setSelected] = useState<Date>(getTomorrowJsDate());
  const [placeholder, setPlaceholder] = useState<string>(getTomorrowIsoDate());

  const {
    open: isOpen,
    ref: dropDownRef,
    toggleOpen: toggleCalendar,
  } = useDropdown();

  const onSelect = (jsDate: any) => {
    if (jsDate instanceof Date) {
      setSelected(jsDate);

      const isoDate = convertJsDate2IsoDate(jsDate);

      setPlaceholder(isoDate);

      onChange(isoDate);

      toggleCalendar();

      return;
    }
    setSelected(getTomorrowJsDate());

    setPlaceholder(getTomorrowIsoDate());

    onChange(getTomorrowIsoDate());
  };

  useEffect(() => {
    if (selected) {
      const isoDate = convertJsDate2IsoDate(selected);

      setPlaceholder(isoDate);

      onChange(isoDate);
    }
    selected && onChange(convertJsDate2IsoDate(selected));
  }, [selected, onChange]);

  useEffect(() => {
    if (defaultValue && defaultValue != "1970-01-01") {
      setPlaceholder(defaultValue);

      onChange(defaultValue);
    }
  }, [onChange, defaultValue]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelected(getTomorrowJsDate());
      setPlaceholder(getTomorrowIsoDate());
    },
  }));

  return {
    isOpen,
    selected,
    onSelect,
    placeholder,
    dropDownRef,
    toggleCalendar,
  };
};
