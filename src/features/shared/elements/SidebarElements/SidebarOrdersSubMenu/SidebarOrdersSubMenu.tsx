import { useEffect, useState } from "react";

import AnimateHeight from "react-animate-height";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";

const SidebarOrdersSubMenu = ({
  isActive = false,
  onClick,
  items,
  readyOrdersCount,
  openOrdersCount,
  validOrdersCount,
  selectedStatus,
  onSubMenuItemClick,
}: any) => {
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  return (
    <div className="flex flex-col gap-2 ">
      <div
        className={`relative rounded-xl duration-300 ${
          isActive && "bg-primary/5 dark:bg-bg3 "
        }`}
      >
        <SidebarButton
          onClick={() => {
            isActive ? setIsOpen(!isOpen) : onClick();
          }}
          isActive={isActive}
          withSubMenu
          isOpen={isOpen}
        />
        <AnimateHeight height={isOpen ? "auto" : 0}>
          <ul className={`px-3 py-3 4xl:px-5`}>
            {items.map(({ name, status }: any) => {
              if (name == "div") {
                return <Divider key={name} />;
              } else {
                let nameAndCount;
                if (openOrdersCount && name == "Open")
                  nameAndCount = name + " " + "(" + openOrdersCount + ")";
                if (validOrdersCount && name == "Valid")
                  nameAndCount = name + " " + "(" + validOrdersCount + ")";
                if (readyOrdersCount && name == "Ready")
                  nameAndCount = name + " " + "(" + readyOrdersCount + ")";
                return (
                  <SidebarSubMenuItem
                    key={name}
                    name={nameAndCount ? nameAndCount : name}
                    onClick={() => onSubMenuItemClick(status)}
                    isActive={selectedStatus == status}
                  />
                );
              }
            })}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarOrdersSubMenu;
