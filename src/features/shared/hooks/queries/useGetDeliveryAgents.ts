import { useState } from "react";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetDeliveryAgents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: deliveryAgents } = useQuery({
    queryKey: ["deliveryAgents"],

    queryFn: async () => {
      setIsLoading(true);
      const { data }: any = await axios.servicesClient.get(
        "/api/delivery/getAllDeliveryAgents",
      );
      setIsLoading(false);
      return data?.deliveryAgents;
    },
  });

  return {
    isLoading,
    deliveryAgents,
  };
};
