import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface CreateRoleData {
  name: string;
}

export function useCreateRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRole = async (data: CreateRoleData, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/roles/create", {
        name: data.name,
      });

      if (response.status === 201) {
        toast.success("Role created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create role";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createRole, isLoading, error };
}
