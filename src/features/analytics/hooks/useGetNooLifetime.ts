import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetNooLifetime = () => {
  const { storeId } = useGlobalStore();

  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery({
    queryKey: ["NooLifetime", storeId],
    queryFn: async () => {
      setIsLoading(true);
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/noo/lifetime?storeId=${storeId}`
          : `/api/analytics/noo/lifetime`,
      );

      setIsLoading(false);

      return { data: data?.data, total: data?.total };
    },
  });

  return {
    data: data?.data,
    total: data?.total,
    isLoading,
  };
};
