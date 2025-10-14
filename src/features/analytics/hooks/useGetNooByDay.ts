import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNooByDay = (date: number) => {
  const { storeId } = useGlobalStore();

  const { isLoading, data } = useQuery({
    queryKey: ["nooByDay", date, storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/noo/byDay?date=${date}&storeId=${storeId}`
          : `/api/analytics/noo/byDay?date=${date}`,
      );

      return { data: data?.data, total: data?.total };
    },
  });

  return {
    data: data?.data,
    total: data?.total,
    isLoading,
  };
};
