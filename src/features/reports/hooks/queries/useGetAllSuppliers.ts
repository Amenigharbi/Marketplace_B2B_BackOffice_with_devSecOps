import { useState } from "react";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSuppliers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],

    queryFn: async () => {
      setIsLoading(true);
      const { data }: any = await axios.servicesClient.get(
        "/api/suppliers/getAllSuppliers",
      );
      setIsLoading(false);

      return data?.suppliers;
    },
  });

  return {
    isLoading,
    suppliers,
  };
};
