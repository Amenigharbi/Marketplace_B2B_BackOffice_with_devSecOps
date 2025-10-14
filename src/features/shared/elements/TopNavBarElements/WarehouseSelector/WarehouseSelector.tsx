"use client";

import { IconBuildingWarehouse, IconChevronDown } from "@tabler/icons-react";

import { useDropdown } from "@/features/shared/hooks/useDropdown";

import { useState } from "react";

export const warehouses = [
  { name: "All", key: "all" },
  { name: "Tunis", key: "tunis1" },
  { name: "Bizert", key: "bizert" },
  { name: "Sousse", key: "sousse" },
];

const WarehouseSelector = ({ isWhite }: { isWhite?: boolean }) => {
  const { open, ref, toggleOpen } = useDropdown();
  const [warehouse, setWarehouse] = useState("All");
  return (
    <div
      ref={ref}
      className="relative hidden min-w-[180px] lg:block xxl:min-w-[200px]"
    >
      <div
        onClick={toggleOpen}
        className={` ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
      >
        <span className="flex select-none items-center gap-2">
          <IconBuildingWarehouse className="text-primary" />
          <p className="font-bold">Warehouse : </p> {warehouse}
        </span>
        <IconChevronDown
          className={`shrink-0 ${open && "rotate-180"} duration-300`}
        />
      </div>
      <ul
        className={`absolute left-0 top-full z-20 w-full origin-top rounded-lg bg-n0 p-2 shadow-md duration-300 dark:bg-n800 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        {warehouses.map((item) => (
          <li
            onClick={() => {
              //changeLayout(item);
              setWarehouse(item.name);
              toggleOpen();
            }}
            className={
              "block cursor-pointer select-none rounded-md p-2 duration-300 hover:text-primary"
              // ${
              // layout == item ? "bg-primary text-n0 hover:!text-n0" : ""
              //  }
              //   `
            }
            key={item.key}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarehouseSelector;
