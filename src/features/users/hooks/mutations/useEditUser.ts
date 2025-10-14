import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGetAllUsers } from "../queries/useGetAllUsers";

export const useEditUser = () => {
  const { navigateToUsersTable } = useNavigation();
  const { refetch: refetchAll } = useGetAllUsers();

  const { mutate, isPending } = useMutation({
    mutationFn: async (user: any) => {
      // Rename password to newPassword before sending
      const { password, ...rest } = user;
      const payload = password ? { ...rest, newPassword: password } : rest;
      await axios.servicesClient.put("/api/users/editUser", payload);
    },
    onSuccess: () => {
      refetchAll();
      toast.success(`User Edited Successfully`, { duration: 5000 });
      navigateToUsersTable();
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    isPending,
    editUser: mutate,
  };
};
