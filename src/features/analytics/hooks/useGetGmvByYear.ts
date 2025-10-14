import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvByYear = (year: string) => {
  const { storeId } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvByYear", year, storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/gmv/byYear?year=${year}&storeId=${storeId}`
          : `/api/analytics/gmv/byYear?year=${year}`,
      );
      return { data: data?.data, total: data?.total };
    },
  });
  return {
    data: data?.data,
    total: data?.total,
    refetch,
    isLoading: isLoading,
  };
};
