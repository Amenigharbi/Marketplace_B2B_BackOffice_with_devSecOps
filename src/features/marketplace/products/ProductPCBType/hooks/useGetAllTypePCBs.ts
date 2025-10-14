import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { TypePcb } from "@/types/typePcb";

export const useGetAllTypePcbs = () => {
  const [typePcbs, setTypePcbs] = useState<TypePcb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypePcbs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        typePcbs: TypePcb[];
      }>("/api/marketplace/type_pcb/getAll");

      setTypePcbs(data.typePcbs || []);
    } catch (err) {
      let errorMessage = "Failed to fetch PCB types";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setTypePcbs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypePcbs();
  }, []);

  return {
    typePcbs,
    isLoading,
    error,
    refetch: fetchTypePcbs,
    isEmpty: !isLoading && !error && typePcbs.length === 0,
  };
};
