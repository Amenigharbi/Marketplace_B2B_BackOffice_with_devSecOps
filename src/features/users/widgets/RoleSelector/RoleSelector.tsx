import { roles } from "../../staticRoles";
import useDropdown from "./useRoleSelector";
import { tailwind } from "./RoleSelector.styles";
import { IconChevronDown } from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useGetUser } from "../../hooks/queries/useGetUser";

export type DropRef = {
  reset: () => void;
  changeSelected: (selected: any) => void;
};

// eslint-disable-next-line react/display-name
const RoleSelector = forwardRef<DropRef, any>(
  (
    {
      isError,
      errorMessage,
      onChange,
      placeholder = "Choose Role",
      defaultValue,
    },
    ref,
  ) => {
    const [selectedRole, setSelectedRole] = useState<any>();
    const { user } = useGetUser();

    const { open, ref: dropRef, toggleOpen } = useDropdown();

    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelectedRole(null);
      },
      changeSelected: (selected: any) => {
        setSelectedRole(selected);
      },
    }));

    useEffect(() => {
      onChange && selectedRole && onChange(selectedRole?.key);
    }, [selectedRole, onChange]);

    useEffect(() => {
      if (user) {
        const value = roles?.find((role: any) => role.key === user.roleId);
        setSelectedRole(value);
      }
    }, [user]);

    return (
      <div className="col-span-2 flex flex-col   md:col-span-1">
        <label className="ml-4  block font-medium md:text-lg">
          Select Role *
        </label>
        <div
          className="relative h-[45px] w-full rounded-3xl  bg-white"
          ref={dropRef}
        >
          <div onClick={toggleOpen} className={tailwind.container("", "")}>
            {selectedRole?.name || placeholder}
            <IconChevronDown
              size={20}
              className={`duration-300 ${open && "rotate-180"}`}
            />
          </div>
          <ul className={tailwind.list("", open)}>
            {roles.map(({ name, key }: any, i: number) => (
              <li
                onClick={() => {
                  setSelectedRole({ name, key });
                  toggleOpen();
                }}
                key={key}
                className={`cursor-pointer rounded-md px-4 py-2 text-xs font-semibold duration-300 hover:bg-primary-50 hover:text-primary ${
                  selectedRole === key && "bg-primary text-n0 hover:!text-n0"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        {isError && <p className="pl-4 pt-1 text-red-500">{errorMessage}</p>}
      </div>
    );
  },
);

export default RoleSelector;
