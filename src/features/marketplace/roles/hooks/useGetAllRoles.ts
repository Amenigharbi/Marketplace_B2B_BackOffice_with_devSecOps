import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Role } from "@/types/role";

export const useGetAllRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        roles: Role[];
      }>("/api/marketplace/roles/getAll");

      setRoles(data.roles || []);
    } catch (err) {
      let errorMessage = "Failed to fetch roles";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    error,
    refetch: fetchRoles,
    isEmpty: !isLoading && !error && roles.length === 0,
  };
};
