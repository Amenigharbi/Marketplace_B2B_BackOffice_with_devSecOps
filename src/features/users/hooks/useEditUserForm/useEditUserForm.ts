import * as z from "zod";
import { editUserFormSchema } from "./editUserformSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useGetUser } from "../queries/useGetUser";
import { useEditUser } from "../mutations/useEditUser";
import { useUsersStore } from "../../stores/usersStore";
import { useGetAllUsers } from "../queries/useGetAllUsers";

type FormData = z.infer<typeof editUserFormSchema>;

export const useEditUserForm = () => {
  const { userOnReviewUsername } = useUsersStore();
  const { editUser, isPending } = useEditUser();
  const { user, refetch } = useGetUser();
  const { refetch: refetchAll } = useGetAllUsers();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editUserFormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await editUser({ username: userOnReviewUsername, ...data });
  };

  useEffect(() => {
    if (user) {
      setValue("firstName", user?.firstName);
      setValue("lastName", user?.lastName);
      setValue("roleId", user?.roleId);
      setValue("mRoleId", user?.mRoleId);
    }
  }, [user]);

  return {
    errors,
    onSubmit,
    register,
    setValue,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending,
    user,
  };
};
