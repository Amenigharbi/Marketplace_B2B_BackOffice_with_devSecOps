import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { TypePartner } from "@/types/typePartner";

export const useGetAllTypePartners = () => {
  const [typePartners, setTypePartners] = useState<TypePartner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypePartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        typePartners: TypePartner[];
      }>("/api/marketplace/typePartner/getAll");

      setTypePartners(data.typePartners || []);
    } catch (err) {
      let errorMessage = "Failed to fetch type partners";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setTypePartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypePartners();
  }, []);

  return {
    typePartners,
    isLoading,
    error,
    refetch: fetchTypePartners,
    isEmpty: !isLoading && !error && typePartners.length === 0,
  };
};
