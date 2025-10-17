import {
  IconX,
  IconBox,
  IconCategory, // Icône pour Domaine
  IconRobot, // Pour Industrie 4.0
  IconBuilding, // Pour Indoor
  IconTrees, // Pour Outdoor
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "./useSidebar";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarSubMenu from "@/features/shared/elements/SidebarElements/SidebarSubMenu";

const Sidebar = ({ setSidebar, sidebarIsOpen }: any) => {
  const { push, pathname, sidebarRef } = useSidebar(setSidebar);

  return (
    <aside
      className={`z-[21] w-[280px] shadow-sm xxxl:w-[336px] ${
        sidebarIsOpen
          ? "visible translate-x-0"
          : "invisible ltr:-translate-x-full rtl:translate-x-full"
      } sidebar fixed top-0 h-full bg-n0 duration-300 dark:bg-bg4 ltr:left-0 rtl:right-0`}
      ref={sidebarRef}
    >
      <div className={`p-5`}>
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image alt="logo" width={180} height={38} src="/images/" />
          </Link>
          <button onClick={() => setSidebar(false)} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12">
        <div className="min-h-[70%] px-4 pb-24 xxl:px-6 xxxl:px-8">
          {/* Domaine */}
          <SidebarSubMenu
            icon={<IconCategory />}
            name="Domaine"
            onClick={() => push("/domaines")}
            isActive={pathname?.toLowerCase().includes("domaine")}
            items={[
              {
                name: "Industrie 4.0",
                path: "/domaines/industrie-4-0",
                icon: <IconRobot size={18} />,
              },
              {
                name: "Indoor",
                path: "/domaines/indoor",
                icon: <IconBuilding size={18} />,
              },
              {
                name: "Out Door",
                path: "/domaines/out-door",
                icon: <IconTrees size={18} />,
              },
            ]}
          />
          <Divider />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
