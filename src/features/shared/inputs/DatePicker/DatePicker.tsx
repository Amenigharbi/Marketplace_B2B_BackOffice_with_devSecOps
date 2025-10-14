import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { IconCalendar } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

//To Refactor
const formatDate = (date: Date): string | undefined => {
  if (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }
};

const matcher = (day: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the day is a Sunday
  const isSunday = day.getDay() === 0;

  // Return false for all previous days (including today) and all upcoming Sundays
  return day <= today || isSunday;
};

const jsDateToUnixTimestamp = (date: any) => Math.floor(date.getTime() / 1000);

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// Check if tomorrow is Sunday, if yes, set to day after tomorrow
if (tomorrow.getDay() === 0) {
  tomorrow.setDate(today.getDate() + 2);
}

//@ts-ignore
// eslint-disable-next-line react/display-name
const DatePicker = forwardRef(
  ({ onChange, direction = "down", isReadOnly, defaultValue }: any, ref) => {
    const { open, ref: dropDownRef, toggleOpen } = useDropdown();
    const [selected, setSelected] = useState(tomorrow);
    const [placeholder, setPlaceholder] = useState(formatDate(selected));

    const onSelect = (date: any) => {
      toggleOpen();
      setSelected(date);
      setPlaceholder(formatDate(date));
    };

    useEffect(() => {
      onChange && selected && onChange(jsDateToUnixTimestamp(selected));
    }, [selected, onChange]);

    useEffect(() => {
      selected && setPlaceholder(formatDate(selected));
    }, [selected, onChange]);

    useEffect(() => {
      if (defaultValue) {
        const defaultDate = new Date(defaultValue * 1000);
        setSelected(defaultDate);
      }
    }, [defaultValue]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelected(tomorrow);
        setPlaceholder(formatDate(tomorrow));
      },
    }));

    return (
      <div
        ref={dropDownRef}
        className="relative  block w-[180px] overflow-visible"
      >
        <div
          onClick={() => {
            !isReadOnly && toggleOpen();
          }}
          className="flex w-full cursor-pointer items-center justify-between gap-2
           rounded-[30px] border border-n30 bg-n0 px-4 py-3 dark:border-n500
            dark:bg-bg4 xxl:px-6"
        >
          <span className="flex select-none items-center gap-2">
            {placeholder}
          </span>
          <div className="flex">
            <IconCalendar />
          </div>
        </div>
        <div
          className={` 
           absolute bottom-full z-50 h-80  w-80  origin-top
           rounded-lg bg-n0  shadow-md duration-300 dark:bg-n800
                  
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
           ${
             open
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0"
           }`}
        >
          <DayPicker
            mode="single"
            disabled={matcher}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      </div>
    );
  },
);

export default DatePicker;
