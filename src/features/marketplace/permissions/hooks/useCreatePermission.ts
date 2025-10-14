import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface CreatePermissionData {
  resource: string;
}

export function useCreatePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPermission = async (
    data: CreatePermissionData, // Accepting the object here
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/permissions/create", {
        resource: data.resource,
      });

      if (response.status === 201) {
        toast.success("Permission created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create permission";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createPermission, isLoading, error };
}
