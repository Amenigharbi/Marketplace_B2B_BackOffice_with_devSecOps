import * as z from "zod";
import { FormSchema } from "./formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateUser } from "../mutations/useCrateUser";

type FormData = z.infer<typeof FormSchema>;

export const useCreateUserForm = () => {
  const { createUser, isPending } = useCreateUser();

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { username, firstName, lastName, roleId, mRoleId, password } = data;

    await createUser({
      roleId,
      mRoleId,
      username,
      lastName,
      password,
      firstName,
    });
  };

  return {
    user: undefined,
    errors,
    onSubmit,
    register,
    setValue,
    getValues,
    handleSubmit: handleSubmit(onSubmit),
    isLoading: isPending,
  };
};
