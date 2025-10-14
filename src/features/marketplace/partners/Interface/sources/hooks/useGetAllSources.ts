import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Source } from "@/types/source";

export const useGetAllSources = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        sources: Source[];
      }>("/api/marketplace/source/getAll");

      setSources(data.sources || []);
    } catch (err) {
      let errorMessage = "Failed to fetch sources";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return {
    sources,
    isLoading,
    error,
    refetch: fetchSources,
    isEmpty: !isLoading && !error && sources.length === 0,
  };
};
