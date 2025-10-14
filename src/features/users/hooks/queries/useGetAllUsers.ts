import { useState } from "react";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: users, refetch } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      setIsLoading(true);
      const { data } = await axios.servicesClient(`/api/users/getAllUsers`);
      setIsLoading(false);
      return data?.users;
    },
  });

  return {
    users,
    refetch,
    isLoading,
  };
};
