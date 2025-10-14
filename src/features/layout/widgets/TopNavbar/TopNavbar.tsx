import { IconMenu2 } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "@/features/shared/elements/TopNavBarElements/Notification";
import Profile from "@/features/shared/elements/TopNavBarElements/Profile";
import StoreSelector from "../StoreSelector/StoreSelector";
import { useLayout } from "@/utils/LayoutContext";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export const layoutList = ["All", "Old Mghira", "Sousse", "Kamarket" , "Mnihla", "Charguia","Mghira"];
//export const layoutList = ["All", "Tunis", "Sousse", "Kamarket" , "Mnihla", "Charguia"];

const TopNav = ({
  setSidebar,
  sidebarIsOpen,
}: {
  setSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
}) => {
  const { layout } = useLayout();
  const { notifications } = useGlobalStore();
  const [newNotification, setNewNotification] = useState(false);
  const [updated, setUpdated] = useState(notifications.length);
  useEffect(() => {
    if (notifications.length !== updated) {
      setNewNotification(true);
      setUpdated(notifications.length);
    }
  }, [notifications, updated]);
  return (
    <nav
      className={`navbar-top z-20 px-4   duration-300 dark:border-b dark:border-n700 xxl:px-6 ${
        sidebarIsOpen
          ? "w-full xxl:w-[calc(100%-280px)] xxxl:w-[calc(100%-336px)] ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]"
          : "w-full"
      }    fixed flex items-center justify-between gap-3 bg-n0 p-3 dark:bg-bg4`}
    >
      <div className="flex grow items-center md:gap-4 xxl:gap-6">
        <button onClick={() => setSidebar(!sidebarIsOpen)}>
          <IconMenu2 />
        </button>
        {/* <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden w-full max-w-[493px] items-center justify-between gap-3 rounded-[30px] border border-transparent bg-primary/5 px-6 focus-within:border-primary dark:bg-bg3 md:flex xxl:px-8"
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent py-2 focus:outline-none md:py-2.5 xxl:py-3"
          />
          <button>
            <IconSearch />
          </button>
        </form> */}
      </div>
      <StoreSelector />
      <div className="flex items-center gap-3 sm:gap-4 xxl:gap-6">
        {/* <ModeSwitcher /> */}
        <div className="relative">
          {newNotification && (
            <div className="absolute right-0 h-3 w-3 rounded-full bg-red-600"></div>
          )}
          <Notification setNewNotification={setNewNotification} />
        </div>
        {/* <SwitchLanguage /> */}
        <Profile />
      </div>
    </nav>
  );
};

export default TopNav;
