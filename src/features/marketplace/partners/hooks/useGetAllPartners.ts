import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Partner } from "@/types/partner";

export const useGetAllPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        data: Partner[];
      }>("/api/marketplace/partners/getAll");

      setPartners(data.data || []);
    } catch (err) {
      let errorMessage = "Failed to fetch partners";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    isLoading,
    error,
    refetch: fetchPartners,
    isEmpty: !isLoading && !error && partners.length === 0,
  };
};
