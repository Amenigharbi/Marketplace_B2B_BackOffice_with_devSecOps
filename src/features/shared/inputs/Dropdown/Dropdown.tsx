import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { tailwind } from "./Dropdown.styles";
import useDropdown from "./useDropdown";

export type DropRef = {
  reset: () => void;
  changeSelected: (selected: any) => void;
};

// eslint-disable-next-line react/display-name
const Dropdown = forwardRef<DropRef, any>(
  (
    {
      items,
      onSelectedChange,
      placeholder = "Choose Action",
      selectedAction,
      setSelectedAction,
    },
    ref,
  ) => {
    const { open, ref: dropRef, toggleOpen } = useDropdown();
    // const [selected, setSelected] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        //  selected && setSelected(null);
      },
      changeSelected: (selected: any) => {
        // setSelected(selected);
        // onSelectedChange(selected.key);
      },
    }));

    return (
      <div className="col-span-2 flex items-center justify-center md:col-span-1">
        <div className="relative rounded-3xl bg-n20" ref={dropRef}>
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            {selectedAction || placeholder}
            <IconChevronDown
              size={20}
              className={`duration-300 ${open && "rotate-180"}`}
            />
          </div>
          <ul className={tailwind.list("", open)}>
            {items.map(({ name, key }: any, i: number) => (
              <li
                onClick={() => {
                  setSelectedAction(items[i].key);
                  // onSelectedChange(items[i].key);
                  toggleOpen();
                }}
                key={key}
                className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300 hover:text-primary ${
                  selectedAction === key && "bg-primary text-n0 hover:!text-n0"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

export default Dropdown;
