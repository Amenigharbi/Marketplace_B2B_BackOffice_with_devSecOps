import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetMilkRunAuditTrail = (page: number) => {
  let {
    isLoading,
    data: auditTrail,
    refetch,
  } = useQuery({
    queryKey: ["MilkRunAuditTrail"],
    queryFn: async () => {
      const { data } = await axios.servicesClient(
        `/api/auditTrail/getMilkRunAuditTrail?page=${page}`,
      );
      return data?.MilkRunLogs;
    },
  });

  return {
    auditTrail,
    refetch,
    isLoading,
  };
};
