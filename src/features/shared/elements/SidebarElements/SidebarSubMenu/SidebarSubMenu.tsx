"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/libs/next-intl/i18nNavigation";

import AnimateHeight from "react-animate-height";
import SidebarButton from "../SidebarButton";
import SidebarSubMenuItem from "../SidebarSubMenuItem";

const SidebarSubMenu = ({
  isActive = false,
  onClick,
  items,
  name,
  icon,
}: any) => {
  const pathname = usePathname();
  const { push } = useRouter();

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
          icon={icon}
          onClick={() => {
            isActive ? setIsOpen(!isOpen) : onClick();
          }}
          isActive={isActive}
          withSubMenu
          name={name}
          isOpen={isOpen}
        />
        <AnimateHeight height={isOpen ? "auto" : 0}>
          <ul className={`px-3 py-3 4xl:px-5`}>
            {items.map(({ name, path }: any) => (
              <SidebarSubMenuItem
                key={name}
                name={name}
                onClick={() => push(path)}
                isActive={pathname?.includes(path)}
              />
            ))}
          </ul>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default SidebarSubMenu;
