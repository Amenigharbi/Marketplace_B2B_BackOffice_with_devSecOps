import { IconBell } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useDropdown } from "@/features/shared/hooks/useDropdown";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useRouter } from "next/navigation";
const Notification = ({
  isWhite,
  setNewNotification,
}: {
  isWhite?: boolean;
  setNewNotification: any;
}) => {
  const { open, ref, toggleOpen } = useDropdown();
  const { notifications } = useGlobalStore();

  const router = useRouter();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          toggleOpen();
          setNewNotification(false);
        }}
        className={` rounded-full p-2 sm:p-3 ${
          isWhite
            ? "border border-n30 bg-n0 dark:border-n500 dark:bg-bg4"
            : "bg-primary/5 dark:bg-bg3"
        }`}
      >
        <IconBell />
      </button>
      <div
        className={`absolute top-full h-80 overflow-scroll rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 max-sm:origin-top ltr:max-sm:-right-[142px] ltr:sm:right-0 ltr:sm:origin-top-right rtl:max-sm:-left-[142px] rtl:sm:left-0 rtl:sm:origin-top-left ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b p-3 dark:border-n500 lg:px-4">
          <h5 className="h5">Notifications</h5>
          <Link
            href="/notifications"
            onClick={toggleOpen}
            className="text-sm text-primary"
          >
            View All
          </Link>
        </div>
        <ul className="flex w-[310px] flex-col p-4">
          {notifications.map((notification: any, idx: number) => (
            <div
              key={notification.id || notification.time || idx}
              className="flex cursor-pointer gap-2 rounded-md p-2 duration-300 hover:bg-primary/10"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                <Image
                  src="/images/avatarUser.jpg"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  alt="img"
                />
              </div>
              <div>
                <div className="gap-1">
                  <div className="text-sm font-medium">{notification.name}</div>
                  <div className="text-sm">{notification.message}</div>
                </div>
                <span className="text-xs text-n100 dark:text-n50">
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
