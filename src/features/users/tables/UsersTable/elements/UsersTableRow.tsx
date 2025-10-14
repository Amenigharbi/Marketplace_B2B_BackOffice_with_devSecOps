import { useEffect, useState } from "react";
import { roles } from "../../../staticRoles";
import UsersTableCell from "./UsersTableCell";
import { IconSettings } from "@tabler/icons-react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useUsersStore } from "@/features/users/stores/usersStore";

const UsersTableRow = ({ user }: any) => {
  const { setUserOnReviewUsername } = useUsersStore();
  const [role, setRole] = useState<any>("");
  const { navigateToEditUserForm } = useNavigation();

  useEffect(() => {
    if (user) {
      const role = roles.find((role) => role.key === user.roleId);
      setRole(role?.name);
    }
  }, [user]);

  return (
    <tr className="transition-colors duration-150 hover:bg-gray-50">
      {/* Username */}
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-sm">{user.username}</p>
      </UsersTableCell>
      {/* Name */}
      <UsersTableCell>
        <p className=" truncate text-ellipsis text-center text-sm">
          {user.firstName + " " + user.lastName}{" "}
        </p>
      </UsersTableCell>
      {/*Role*/}
      <UsersTableCell>
        <span
          key={1}
          className="m-2 inline-block text-ellipsis whitespace-nowrap rounded-full rounded-xl border border-n30 bg-secondary1/10 p-1 px-4 py-2 text-center text-xs font-bold text-secondary dark:border-n500 dark:bg-bg3 "
        >
          {role}
        </span>
      </UsersTableCell>
      {/*Edit*/}
      <UsersTableCell>
        <div className="flex items-center justify-center">
          <IconSettings
            onClick={() => {
              setUserOnReviewUsername(user.username);
              navigateToEditUserForm();
            }}
            className="cursor-pointer "
          />
        </div>
      </UsersTableCell>
    </tr>
  );
};

export default UsersTableRow;
