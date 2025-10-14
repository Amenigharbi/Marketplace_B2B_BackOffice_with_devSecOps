import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGmvLifetime = () => {
  const { storeId } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["gmvLifetime", storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/gmv/lifetime?storeId=${storeId}`
          : `/api/analytics/gmv/lifetime`,
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
