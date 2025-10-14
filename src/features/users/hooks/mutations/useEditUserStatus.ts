import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useGetUser } from "../queries/useGetUser";

export const useEditUserStatus = () => {
  const { refetch } = useGetUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ username, status }: any) => {
      await axios.servicesClient.put("/api/users/editUserStatus", {
        username,
        status,
      });
    },
    onSuccess: () => {
      toast.success(`User Status Edited Successfully`, { duration: 5000 });
      refetch();
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    isPending,
    editUserStatus: mutate,
  };
};
