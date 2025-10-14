import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@/features/shared/hooks/useNavigation";

export const useCreateUser = () => {
  const { navigateToUsersTable } = useNavigation();

  const { mutate, isPending } = useMutation({
    mutationFn: async (user: any) => {
      await axios.servicesClient.post("/api/users/createUser", user);
    },
    onSuccess: () => {
      navigateToUsersTable();
      toast.success(`User Created Successfully`, { duration: 5000 });
    },
    onError: () => {
      toast.error(`Something Went Wrong`, { duration: 5000 });
    },
  });

  return {
    isPending,
    createUser: mutate,
  };
};
