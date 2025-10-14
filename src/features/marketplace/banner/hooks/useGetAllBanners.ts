import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Banner } from "@/types/banner";

export const useGetAllBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        banners: Banner[];
      }>("/api/marketplace/banner/getAll");

      setBanners(data.banners || []);
    } catch (err) {
      let errorMessage = "Failed to fetch banners";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    isLoading,
    error,
    refetch: fetchBanners,
    isEmpty: !isLoading && !error && banners.length === 0,
  };
};
