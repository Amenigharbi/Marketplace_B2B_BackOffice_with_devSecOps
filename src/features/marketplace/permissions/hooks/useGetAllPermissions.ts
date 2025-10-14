import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Permission } from "@/types/permission";

export const useGetAllPermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        permissions: Permission[];
      }>("/api/marketplace/permissions/getAll");

      setPermissions(data.permissions || []);
    } catch (err) {
      let errorMessage = "Failed to fetch permissions";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    isLoading,
    error,
    refetch: fetchPermissions,
    isEmpty: !isLoading && !error && permissions.length === 0,
  };
};
