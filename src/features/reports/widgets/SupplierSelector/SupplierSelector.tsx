import { IconChevronDown } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { forwardRef, useImperativeHandle, useState } from "react";

//@ts-ignore
// eslint-disable-next-line react/display-name
const SupplierSelector = forwardRef(
  ({ suppliers, onChange, direction = "down" }: any, ref) => {
    const { open, ref: DropDownRef, toggleOpen } = useDropdown();

    const [layout, setLayout] = useState("All");

    useImperativeHandle(ref, () => ({
      reset: () => {
        onChange("");
        setLayout("All");
      },
    }));

    return (
      <div ref={DropDownRef} className="relative  ">
        <div
          onClick={toggleOpen}
          className={` ${
            true
              ? "min-w-72 border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
              : "bg-primary/5 dark:bg-bg3"
          } flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] px-4 py-3 xxl:px-6`}
        >
          <span className="flex select-none items-center gap-2">{layout}</span>
          <IconChevronDown
            className={`shrink-0 ${open && "rotate-180"} duration-300`}
          />
        </div>
        <ul
          className={`absolute left-0 z-20 max-h-64 w-full origin-top overflow-x-hidden overflow-y-scroll rounded-lg bg-n0 p-2 shadow-md duration-300 dark:bg-n800 ${
            open
              ? "visible scale-100 opacity-100"
              : "invisible scale-0 opacity-0"
          }
              
          
           ${direction === "up" && "bottom-full"}
           ${direction === "down" && "top-full"}
          
          
          
          
          
          
          `}
        >
          {suppliers?.map((supplier: any) => (
            <li
              onClick={() => {
                toggleOpen();
                setLayout(supplier?.company_name);
                onChange({
                  id: supplier?.manufacturer_id,
                  name: supplier?.company_name,
                });
              }}
              className={`block cursor-pointer select-none rounded-md p-2 duration-300 hover:bg-slate-200 hover:text-primary ${
                layout == supplier.name
                  ? "bg-primary text-n0 hover:!text-n0"
                  : ""
              }`}
              key={supplier.manufacturer_id}
            >
              {supplier?.company_name}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

export default SupplierSelector;
