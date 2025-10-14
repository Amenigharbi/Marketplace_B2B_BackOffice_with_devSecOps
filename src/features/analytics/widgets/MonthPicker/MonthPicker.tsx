import { IconCalendar } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useEffect, useState } from "react";

const Month = ({ name, onClick, selectedMonth }: any) => (
  <div
    onClick={onClick}
    className={` m-1 flex h-12 w-20 cursor-pointer items-center justify-center rounded-md
      ${
        selectedMonth.name === name
          ? "bg-blue-950 text-white"
          : "border-none bg-slate-50 text-blue-950"
      } 
      transition duration-150 hover:bg-gray-200`}
  >
    <p className="text-sm">{name}</p>
  </div>
);

const months = [
  { name: "Jan", key: "01" },
  { name: "Feb", key: "02" },
  { name: "Mar", key: "03" },
  { name: "Apr", key: "04" },
  { name: "May", key: "05" },
  { name: "Jun", key: "06" },
  { name: "Jul", key: "07" },
  { name: "Aug", key: "08" },
  { name: "Sep", key: "09" },
  { name: "Oct", key: "10" },
  { name: "Nov", key: "11" },
  { name: "Dec", key: "12" },
];

const MonthPicker = ({ direction = "down", onMonthChange }: any) => {
  const { open, ref: dropDownRef, toggleOpen } = useDropdown();

  const date = new Date();
  const currentMonthIndex = date.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    //   toggleOpen();

    if (onMonthChange) {
      const formattedDate = `${year}-${selectedMonth.key}-01`;
      onMonthChange(formattedDate);
    }
  }, [selectedMonth, year, onMonthChange, toggleOpen]);

  const handleYearChange = (indicator: number) => {
    setYear((year) => year + indicator);
  };

  const isPrevYearDisabled = year <= 2020;
  const isNextYearDisabled = year >= new Date().getFullYear();

  return (
    <div ref={dropDownRef} className="relative  block w-[220px] ">
      <div
        onClick={() => {
          toggleOpen();
        }}
        className="border-50 flex w-full cursor-pointer items-center justify-between
           gap-2 rounded-[30px] border bg-n20 px-4 py-3 dark:border-n500
            dark:bg-bg4 xxl:px-6"
      >
        <span className="flex select-none items-center gap-2 font-semibold">
          {selectedMonth.name} {year}
        </span>
        <div className="flex">
          <IconCalendar />
        </div>
      </div>
      <div
        className={` 
           absolute right-5 z-20 h-80  w-80  origin-top
           rounded-lg bg-white  duration-300 
                  
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
           ${
             open
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0"
           }`}
      >
        <div className="flex h-10 w-full items-center justify-center bg-white text-xl font-semibold">
          <button
            onClick={() => handleYearChange(-1)}
            disabled={isPrevYearDisabled}
            className={`px-2 py-1 ${
              isPrevYearDisabled
                ? "cursor-not-allowed text-gray-400"
                : "text-blue-950"
            }`}
          >
            &lt;
          </button>
          <span className="mx-4 text-xl">{year}</span>
          <button
            onClick={() => handleYearChange(1)}
            disabled={isNextYearDisabled}
            className={`px-2 py-1 ${
              isNextYearDisabled
                ? "cursor-not-allowed text-gray-400"
                : "text-blue-950"
            }`}
          >
            &gt;
          </button>
        </div>
        <div className="flex h-full w-full flex-grow flex-wrap items-center justify-center bg-n10 ">
          {months.map((month: any) => (
            <Month
              key={month.key}
              name={month.name}
              selectedMonth={selectedMonth}
              onClick={() => {
                setSelectedMonth(month);

                toggleOpen();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthPicker;
