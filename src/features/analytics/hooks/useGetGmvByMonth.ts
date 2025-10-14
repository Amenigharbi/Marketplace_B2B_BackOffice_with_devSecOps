import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByMonth = ({ year, month }: any) => {
  const { storeId } = useGlobalStore();
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvByMonthAnalytics", year, storeId],
    queryFn: async () => {
      //@ts-ignore

      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/gmv/byMonth?year=${year}&month=${month}&storeId=${storeId}`
          : `/api/analytics/gmv/byMonth?year=${year}&month=${month}`,
      );

      return { data: data?.data, total: data?.total };
    },
  });
  return {
    data: data?.data,
    total: data?.total,
    isLoading,
    refetch,
  };
};
