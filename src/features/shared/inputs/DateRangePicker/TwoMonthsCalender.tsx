import React, { ChangeEventHandler, useEffect, useState } from "react";
import { format, isAfter, isBefore, isValid, parse } from "date-fns";
import "react-day-picker/dist/style.css";

import {
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
} from "react-day-picker";
import { Button } from "@nextui-org/button";

const TwoMonthsCalender = ({ onChange }: any) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    setSelectedRange(range);
    if (range?.from) {
      setFromValue(format(range.from, "y-MM-dd"));
    } else {
      setFromValue("");
    }
    if (range?.to) {
      setToValue(format(range.to, "y-MM-dd"));
    } else {
      setToValue("");
    }
  };

  useEffect(() => {
    if (fromValue && toValue) {
      onChange({ fromDate: fromValue, toDate: toValue });
    }
  }, [fromValue, toValue, onChange]);

  return (
    <div>
      <DayPicker
        numberOfMonths={2}
        mode="range"
        selected={selectedRange}
        onSelect={handleRangeSelect}
      />
      {/* 
      <Button>Confirm</Button> */}
    </div>
  );
};

export default TwoMonthsCalender;
