import { IconCalendar } from "@tabler/icons-react";
import TwoMonthsCalender from "./TwoMonthsCalender";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
// //To Refactor

//@ts-ignore
// eslint-disable-next-line react/display-name
const DatePicker = forwardRef(
  ({ onChange, direction = "down", isReadOnly, defaultValue }: any, ref) => {
    const { open, ref: dropDownRef, toggleOpen } = useDropdown();

    const [toDate, setToDate] = useState("");
    const [fromDate, setFromDate] = useState("");

    useEffect(() => {
      if (toDate && fromDate) {
        onChange({ fromDate, toDate });
      }
    }, [toDate, fromDate, onChange]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        // setSelected(tomorrow);
        //  setPlaceholder(formatDate(tomorrow));
      },
    }));

    return (
      <div
        ref={dropDownRef}
        className="relative  block  w-80 overflow-visible "
      >
        <div
          onClick={() => {
            !isReadOnly && toggleOpen();
          }}
          className="w-92  flex cursor-pointer items-center justify-between gap-2
           rounded-[30px] border border-n30 bg-n0 px-4 py-3 dark:border-n500
            dark:bg-bg4 xxl:px-6"
        >
          {!!fromDate && !!toDate && (
            <span className=" w-80  ">
              {fromDate} * {toDate}
            </span>
          )}
          {!fromDate && !toDate && (
            <span className=" flex w-80 items-center justify-center">
              *****
            </span>
          )}
          <div className="flex">
            <IconCalendar />
          </div>
        </div>
        <div
          className={` 
           absolute bottom-full right-0 z-50  h-80 origin-top
           rounded-lg bg-n0  shadow-md duration-300 dark:bg-n800
                  
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
           ${
             open
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0"
           }`}
        >
          <TwoMonthsCalender
            onChange={(e: any) => {
              setToDate(e?.toDate);
              setFromDate(e?.fromDate);
            }}
          />
        </div>
      </div>
    );
  },
);

export default DatePicker;
