import useDropdown from "./useDropdown";
import { tailwind } from "./Dropdown.styles";
import { Props, DropRef } from "./Dropdown.types";
import { IconChevronDown } from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle } from "react";

// eslint-disable-next-line react/display-name
const Dropdown = forwardRef<DropRef, Props>(
  ({ items = [], onSelect, selected, placeholder }, ref) => {
    const { open, ref: dropRef, toggleOpen } = useDropdown();

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (placeholder) {
          onSelect && onSelect(undefined);
        } else {
          onSelect && onSelect(items[0]);
        }
      },
    }));

    useEffect(() => {
      if (!placeholder) {
        onSelect && onSelect(items[0]);
      }
      //Problem in Dependencies
    }, []);

    return (
      <div className="col-span-2 flex items-center justify-center px-6 md:col-span-1">
        <div
          className="relative flex h-12 justify-center rounded-3xl bg-n20 text-xl font-semibold  shadow-sm"
          ref={dropRef}
        >
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            <p className="">{selected?.name || placeholder}</p>
            <IconChevronDown
              size={20}
              className={`duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
          <ul className={tailwind.list("", open)}>
            {items.map((item: any) => (
              <li
                onClick={() => {
                  toggleOpen();
                  onSelect && onSelect(item);
                }}
                key={item?.key}
                className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300 hover:bg-slate-400 hover:text-primary ${
                  selected?.key === item?.key
                    ? "bg-primary text-n0 hover:!text-n0"
                    : ""
                }`}
              >
                {item?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

export default Dropdown;
