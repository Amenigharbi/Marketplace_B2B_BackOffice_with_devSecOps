import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
export const useGetOrdersAuditTrail = (page: number) => {
  let { isLoading, data, refetch } = useQuery({
    queryKey: ["ordersAuditTrail"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/auditTrail/getOrdersAuditTrail?page=${page}`,
      );

      return { data: data?.ordersLogs, count: data?.count };
    },
  });

  return {
    //@ts-ignore
    auditTrail: data?.data,
    count: data?.count,
    refetch,
    isLoading,
  };
};
