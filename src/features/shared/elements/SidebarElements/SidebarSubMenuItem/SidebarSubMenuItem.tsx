import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Props } from "./SidebarSubMenuItem.types";

const SidebarSubMenuItem = ({
  name = "Open Orders",
  onClick,
  isActive = false,
}: Props) => {
  return (
    <div onClick={onClick}>
      <div
        className={` flex cursor-pointer px-3 py-2.5  capitalize duration-300 hover:text-primary md:py-3 
        lg:text-base xxxl:px-6 
        ${isActive && " text-3xl font-extrabold text-primary "}
           ${!isActive && "text-xl font-medium"}
        
        `}
      >
        <IconArrowNarrowRight />
        <p className="ml-2">{name}</p>
      </div>
    </div>
  );
};

export default SidebarSubMenuItem;
