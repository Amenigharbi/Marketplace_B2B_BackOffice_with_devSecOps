import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNumberOfUniqueCustomerByYearAnalytics = (year: number) => {
  const { storeId } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["numberOfUniqueCustomerByYearAnalytics", year, storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/nuc/byYear?year=${year}&storeId=${storeId}`
          : `/api/analytics/nuc/byYear?year=${year}`,
      );
      return data?.data;
    },
  });

  return {
    data,
    refetch,
    isLoading,
  };
};
