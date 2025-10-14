import Image from "next/image";
import { logError } from "@/utils/logError";
import { useAuth } from "@/features/shared/hooks/useAuth";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useDropdown } from "@/features/shared/hooks/useDropdown";

const useList = () => {
  const { logout } = useAuth();

  const list = [
    {
      icon: <IconSettings size={18} />,
      url: "/settings",
      title: "Settings",
      onClick: () => {},
    },
    {
      icon: <IconLogout size={18} />,
      url: "/login",
      title: "Logout",
      onClick: async () => {
        try {
          await logout();
        } catch (error: any) {
          logError(error);
        }
      },
    },
  ];

  return { list };
};
const Profile = () => {
  const { list } = useList();
  const { open, ref, toggleOpen } = useDropdown();
  const { user } = useAuth();

  return (
    <div className="relative shrink-0" ref={ref}>
      <div className="w-10 cursor-pointer sm:w-12" onClick={toggleOpen}>
        <Image
          loading="eager"
          priority={true}
          src="/images/avatarUser.jpg"
          className="rounded-full"
          width={48}
          height={48}
          alt="profile img"
        />
      </div>
      <div
        className={`absolute top-full z-20 rounded-md border bg-n0 shadow-lg duration-300 dark:border-n500 dark:bg-n800 ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left ${
          open ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center border-b p-3 text-center dark:border-n500 lg:p-4">
          <Image
            loading="eager"
            priority={true}
            src="/images/avatarUser.jpg"
            width={60}
            height={60}
            className="rounded-full"
            alt="profile img"
          />

          <h6 className="h6 mt-2">
            {
              //@ts-ignore
              user?.firstName
            }{" "}
            {
              //@ts-ignore
              user?.lastName
            }
          </h6>
          {/* <span className="text-sm">username@kamioun.tn</span> */}
        </div>
        <ul className="flex w-[250px] flex-col p-4">
          {list.map(({ icon, title, url, onClick }) => (
            <li key={title}>
              <div
                onClick={() => onClick()}
                className=" flex cursor-pointer items-center gap-2 rounded-md p-2 duration-300 hover:bg-primary hover:text-n0"
              >
                <span>{icon}</span>
                {title}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
