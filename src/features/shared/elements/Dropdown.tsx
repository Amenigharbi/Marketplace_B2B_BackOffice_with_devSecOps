"use client";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { IconChevronDown } from "@tabler/icons-react";
type dropdownProps = {
  items: string[];
  selected?: string;
  setSelected: (item: string) => void;
  width?: string;
  bg?: string;
};
const Dropdown = ({
  items,
  selected,
  setSelected,
  width,
  bg,
}: dropdownProps) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <div
        onClick={toggleOpen}
        className={`flex cursor-pointer select-none items-center justify-between gap-2 rounded-[30px] border border-n30 px-3 py-1.5 text-xs dark:border-n500 sm:px-4 sm:py-2  ${
          width ? width : "min-w-max sm:min-w-[140px]"
        } ${bg ? bg : "bg-primary/5 dark:bg-bg3 "}`}
      >
        {selected}{" "}
        <IconChevronDown
          size={20}
          className={`duration-300 ${open && "rotate-180"}`}
        />
      </div>
      <ul
        className={`absolute z-20 flex-col rounded-md ${
          width ? width : "min-w-max sm:min-w-[140px]"
        } top-full max-h-40 origin-top overflow-y-auto rounded-md border border-n30 bg-n0 p-1 shadow-md duration-300 dark:border-n500 dark:bg-bg4 ltr:right-0 rtl:left-0 ${
          open
            ? "visible flex scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
      >
        <li
          onClick={() => {
            // setSelected(item);
            toggleOpen();
          }}
          key={0}
          className={`cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary ${
            false && "bg-primary text-n0 hover:!text-n0"
          }`}
        >
          Select Action
        </li>
        {items.map((item) => (
          <li
            onClick={() => {
              setSelected(item);
              toggleOpen();
            }}
            key={item}
            className={`cursor-pointer rounded-md px-4 py-2 text-xs duration-300 hover:text-primary ${
              selected == item && "bg-primary text-n0 hover:!text-n0"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
