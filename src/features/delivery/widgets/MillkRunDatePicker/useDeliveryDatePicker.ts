import { useState, useImperativeHandle, useEffect } from "react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { convertJsDate2IsoDate } from "@/utils/date/convertJsDate2IsoDate";

const getTodayIsoDate = () => {
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];
  return todayIso;
};

export const useDeliveryDatePicker = ({ onChange, ref }: any) => {
  const [selected, setSelected] = useState<Date>(new Date());
  const [placeholder, setPlaceholder] = useState<string>(getTodayIsoDate());

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
    setSelected(new Date());

    setPlaceholder(getTodayIsoDate());

    onChange(getTodayIsoDate());
  };

  useEffect(() => {
    if (selected) {
      const isoDate = convertJsDate2IsoDate(selected);

      setPlaceholder(isoDate);

      onChange(isoDate);
    }
    selected && onChange(convertJsDate2IsoDate(selected));
  }, [selected, onChange]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelected(new Date());
      setPlaceholder(getTodayIsoDate());
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
