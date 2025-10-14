import RoleSelector from "../../widgets/RoleSelector";
import Loading from "@/features/shared/elements/Loading";
import TextInput from "@/features/shared/inputs/TextInput";
import { useCreateUserForm } from "../../hooks/useCreateUserForm";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import GoBackArrow from "../../widgets/GoBackArrow";

//Marketplace
import axios from "axios";
import { useEffect, useState } from "react";

const CreateUserForm = () => {
  const { navigateToUsersTable, navigateBack } = useNavigation();

  const { handleSubmit, register, setValue, errors, isLoading } =
    useCreateUserForm();

  const [roles, setRoles] = useState([]);
  const [mRoleId, setMRoleId] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/marketplace/roles/getAll"),
        ]);
        const [roles] = await Promise.all(responses.map((res) => res.json()));
        setRoles(roles.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      <form
        className="w-full lg:col-span-7 xl:col-span-8"
        onSubmit={handleSubmit}
      >
        <div className="box w-full min-w-[800px]  xl:p-8">
          <div className="bb-dashed mb-6 flex items-center  pb-6">
            <GoBackArrow onClick={navigateBack} />
            <p className="ml-4 text-xl font-bold">Create User</p>
          </div>
          <div className="box mb-6 grid grid-cols-2 gap-4 bg-primary/5 dark:bg-bg3 md:p-4 xl:p-6 xxxl:gap-6">
            <TextInput
              label="Username * "
              isError={errors.username}
              placeholder="Enter username"
              register={register("username")}
              errorMessage={errors.username?.message}
            />
            <RoleSelector
              isError={errors.roleId}
              errorMessage={errors.roleId?.message}
              onChange={(roleId: string) => setValue("roleId", roleId)}
            />

            <div className="col-span-2 md:col-span-1">
              <label className="ml-4 block font-medium md:text-lg">
                Marketplace Role *
              </label>
              <div className="relative h-[45px] w-full rounded-3xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-bg3">
                <select
                  {...register("mRoleId")}
                  className="h-full w-full appearance-none rounded-3xl px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                >
                  <option value="">Select a role</option>
                  {roles.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.mRoleId && (
                <p className="ml-4 mt-1 text-sm text-red-500">
                  {errors.mRoleId.message}
                </p>
              )}
            </div>

            <TextInput
              label="First Name *"
              isError={errors.firstName}
              placeholder="Enter first name"
              register={register("firstName")}
              errorMessage={errors.firstName?.message}
            />
            <TextInput
              label="Last Name *"
              isError={errors.lastName}
              placeholder="Enter lastName"
              register={register("lastName")}
              errorMessage={errors.lastName?.message}
            />

            <PasswordInput
              label="Password *"
              isError={errors.password}
              register={register("password")}
              errorMessage={errors.password?.message}
            />
            <PasswordInput
              label="Confirm Password *"
              isError={errors.confirmPassword}
              register={register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>

          <div className="mt-6">
            <div className="mt-7 flex gap-4 lg:mt-10">
              {!isLoading && (
                <button type="submit" className="btn px-4 hover:shadow-none">
                  Create
                </button>
              )}
              {isLoading && <Loading />}
              <button
                type="reset"
                className="btn-outline px-4 shadow-none"
                onClick={navigateToUsersTable}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
