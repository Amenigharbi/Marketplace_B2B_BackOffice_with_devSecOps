import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface CreateSourceData {
  name: string;
}

export function useCreateSource() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSource = async (
    data: CreateSourceData,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/source/create", {
        name: data.name,
      });

      if (response.status === 201) {
        toast.success("Source created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create source";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createSource, isLoading, error };
}
