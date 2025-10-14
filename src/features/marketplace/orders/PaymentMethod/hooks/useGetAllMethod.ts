import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Methods } from "@/types/Methods";

export const useGetAllMethods = () => {
  const [Methods, setMethod] = useState<Methods[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethod = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        orderPayments: Methods[];
      }>("/api/marketplace/payment_method/getAll");

      setMethod(data.orderPayments || []);
    } catch (err) {
      let errorMessage = "Failed to fetch methods";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setMethod([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethod();
  }, []);
  return {
    Methods,
    isLoading,
    error,
    refetch: fetchMethod,
    isEmpty: !isLoading && !error && Methods.length === 0,
  };
};
