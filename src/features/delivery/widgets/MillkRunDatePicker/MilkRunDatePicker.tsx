import { forwardRef } from "react";
import { matcher } from "./matcher";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { IconCalendar } from "@tabler/icons-react";
import { useDeliveryDatePicker } from "./useDeliveryDatePicker";

// eslint-disable-next-line react/display-name
const MilkRunDatePicker = forwardRef(
  ({ onChange, direction = "down", isReadOnly = false }: any, ref) => {
    const {
      isOpen,
      selected,
      onSelect,
      dropDownRef,
      placeholder,
      toggleCalendar,
    } = useDeliveryDatePicker({ onChange, ref });

    return (
      <div ref={dropDownRef} className="relative  block w-[180px] ">
        <div
          onClick={() => {
            !isReadOnly && toggleCalendar();
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
           absolute bottom-full z-20 h-80  w-80  origin-top
           rounded-lg bg-n0  shadow-md duration-300 dark:bg-n800

           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
           ${
             isOpen
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

export default MilkRunDatePicker;
