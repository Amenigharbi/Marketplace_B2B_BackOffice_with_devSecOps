import {
  IconX,
  IconUsers,
  IconShoppingCart,
  IconClipboardCheck,
  IconBox,
  IconUser,
  IconTruck,
  IconPhoto,
  IconBuildingStore,
  IconSettings,
  IconDashboard,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "./useSidebar";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import SidebarButton from "@/features/shared/elements/SidebarElements/SidebarButton";
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
            <Image
              alt="logo"
              width={180}
              height={38}
              src="/images/Kamioun-logo-text.png"
            />
          </Link>
          <button onClick={() => setSidebar(false)} className="xxl:hidden">
            <IconX />
          </button>
        </div>
      </div>
      <div className="fixed left-0 right-0 h-full overflow-y-auto pb-12">
        <div className="min-h-[70%] px-4 pb-24 xxl:px-6 xxxl:px-8">
          <SidebarButton
            name="Dashboard"
            icon={<IconDashboard />}
            onClick={() => push("/marketplace/dashboard")}
            isActive={pathname?.includes("/marketplace/dashboard")}
          />
          <Divider />

          {/* Products */}
          <SidebarSubMenu
            icon={<IconShoppingCart />}
            name="Products"
            onClick={() => push("/marketplace/products")}
            isActive={pathname?.includes("products")}
            items={[
              { name: "All", path: "/marketplace/products" },
              { name: "Categories", path: "/marketplace/products/categories" },
              {
                name: "Suppliers",
                path: "/marketplace/products/manufacturer/all",
              },
            ]}
          />
          <Divider />

          {/* Partners */}
          <SidebarSubMenu
            icon={<IconBuildingStore />}
            name="Partners"
            onClick={() => push("/marketplace/partners")}
            isActive={pathname?.includes("partners")}
            items={[{ name: "All partners", path: "/marketplace/partners" }]}
          />
          <Divider />

          {/* Settings */}
          <SidebarSubMenu
            icon={<IconSettings />}
            name="Settings"
            onClick={() => push("/marketplace/settings")}
            isActive={pathname?.includes("Settings")}
            items={[{ name: "All settings", path: "/marketplace/settings" }]}
          />
          <Divider />

          {/* Purchase order */}
          <SidebarSubMenu
            icon={<IconShoppingCart />}
            name="Purchase order"
            onClick={() => push("/suppliers/all")}
            isActive={pathname?.includes("suppliers")}
            items={[
              { name: "All", path: "/suppliers/all" },
              { name: "In Progress", path: "/suppliers/inProg" },
              { name: "Ready", path: "/suppliers/readyState" },
              { name: "Delivered", path: "/suppliers/deliveredState" },
              { name: "Completed", path: "/suppliers/completedState" },
            ]}
          />
          <Divider />

          {/* Reservation */}
          <SidebarSubMenu
            icon={<IconClipboardCheck />}
            name="Reservation"
            onClick={() => push("/marketplace/reservation/all")}
            isActive={pathname?.includes("reservation")}
            items={[{ name: "All", path: "/marketplace/reservation/all" }]}
          />
          <Divider />

          {/* Order */}
          <SidebarSubMenu
            icon={<IconBox />}
            name="Order"
            onClick={() => push("/marketplace/orders2/all")}
            isActive={pathname?.toLowerCase().includes("order")}
            items={[
              { name: "All", path: "/marketplace/orders2/all" },
              { name: "State", path: "/marketplace/order/state" },
              { name: "Status", path: "/marketplace/order/status" },
            ]}
          />
          <Divider />

          {/* Banner */}
          <SidebarButton
            name="Banner"
            icon={<IconPhoto />}
            onClick={() => push("/marketplace/banner")}
            isActive={pathname?.includes("/marketplace/banner")}
          />
          <Divider />

          {/* Delivery Agent */}
          <SidebarButton
            name="Delivery Agent"
            icon={<IconTruck />}
            onClick={() => push("/marketplace/deliveryAgent")}
            isActive={pathname?.includes("deliveryAgent")}
          />
          <Divider />

          <div className="flex flex-col gap-2">
            <SidebarButton
              name="Customer"
              icon={<IconUser />}
              onClick={() => push("/marketplace/customer")}
              isActive={pathname?.includes("customer")}
            />

            <SidebarSubMenu
              icon={<IconUsers />}
              name="Access Control"
              onClick={() => push("/access/users")}
              isActive={pathname?.includes("access")}
              items={[
                { name: "Users", path: "/access/users" },
                { name: "Roles", path: "/marketplace/roles" },
                { name: "Permissions", path: "/marketplace/permissions" },
                { name: "RBAC", path: "/access/RBAC" },
                { name: "Logs", path: "/access/logs" },
              ]}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
