import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetNooByMonth = (year: number, month: number) => {
  const { storeId } = useGlobalStore();

  const [isLoading, setIsLoading] = useState(false);
  const { data } = useQuery({
    queryKey: ["numberOfOrdersByMonthAnalytics", year, month, storeId],
    queryFn: async () => {
      setIsLoading(true);
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/noo/byMonth?year=${year}&month=${month}&storeId=${storeId}`
          : `/api/analytics/noo/byMonth?year=${year}&month=${month}`,
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
