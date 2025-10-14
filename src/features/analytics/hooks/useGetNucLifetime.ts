import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetNucLifetime = () => {
  const { storeId } = useGlobalStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["nucLifetime", storeId],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        storeId
          ? `/api/analytics/nuc/lifetime?storeId=${storeId}`
          : `/api/analytics/nuc/lifetime`,
      );
      return data?.data;
    },
  });
  return {
    data,
    refetch,
    isLoading: isLoading,
  };
};
