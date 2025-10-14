import { IconCalendar } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const Year = ({ year, onClick, selectedYear }: any) => (
  <div
    onClick={onClick}
    className={`m-1 flex h-12 w-20 items-center justify-center rounded-md
      ${
        selectedYear === year
          ? "bg-blue-950 text-white"
          : "border-none bg-slate-50 text-blue-950"
      } 
      transition duration-150 hover:bg-gray-200`}
  >
    <p className="text-sm">{year}</p>
  </div>
);

const YearPicker = ({ onYearChange }: any) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (onYearChange) {
      onYearChange(selectedYear);
    }
  }, [selectedYear, onYearChange]);

  const isPrevYearDisabled = selectedYear <= 2020;
  const isNextYearDisabled = selectedYear >= new Date().getFullYear();

  return (
    <div className="relative  flex h-12   items-center justify-center ">
      <div
        className="border-50 flex h-12 w-full  items-center
          justify-between gap-2 rounded-[30px]  border bg-n20 px-4
            py-3 dark:border-n500 dark:bg-bg4 xxl:px-6"
      >
        <div className="flex items-center justify-center text-xl font-semibold">
          <button
            onClick={() => setSelectedYear((prevYear) => prevYear - 1)}
            disabled={isPrevYearDisabled}
            className={`px-2 py-1 ${
              isPrevYearDisabled
                ? "cursor-not-allowed text-gray-400"
                : "text-blue-950"
            }`}
          >
            &lt;
          </button>
          <span className="mx-4 text-xl">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear((prevYear) => prevYear + 1)}
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
        {/* <div className="flex">
          <IconCalendar />
        </div> */}
      </div>
    </div>
  );
};

export default YearPicker;
