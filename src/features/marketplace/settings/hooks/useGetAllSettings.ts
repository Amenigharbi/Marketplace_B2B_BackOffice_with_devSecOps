import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Setting } from "@/types/settings";

export const useGetAllSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ settings: Setting[] }>(
        "/api/marketplace/settings/getAll",
      );

      setSettings(data.settings || []);
    } catch (err) {
      let errorMessage = "Failed to fetch settings";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setSettings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
    isEmpty: !isLoading && !error && settings.length === 0,
  };
};
