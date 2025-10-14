import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Status } from "@/types/status";

export const useGetAllStatus = () => {
  const [status, setStatus] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ statuses: Status[] }>(
        "/api/marketplace/status/getAll",
      );
      setStatus(data.statuses || []);
    } catch (err) {
      let errorMessage = "Failed to fetch status";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setStatus([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);
  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
    isEmpty: !isLoading && !error && status.length === 0,
  };
};
