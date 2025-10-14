import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Log } from "@/types/log";

export const useGetAllLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ logs: Log[] }>(
        "/api/log",
      );

      setLogs(data.logs || []);
    } catch (err) {
      let errorMessage = "Failed to fetch logs";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    isLoading,
    error,
    refetch: fetchLogs,
    isEmpty: !isLoading && !error && logs.length === 0,
  };
};
