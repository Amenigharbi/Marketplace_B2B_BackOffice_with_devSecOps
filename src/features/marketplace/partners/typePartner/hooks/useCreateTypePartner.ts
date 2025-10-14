import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateTypePartner() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTypePartner = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    if (!name?.trim()) {
      const errorMessage = "Partner type name is required";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/marketplace/typePartner/create", {
        name: name.trim(),
      });
      if (response.status === 201) {
        toast.success("Partner type created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create partner type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTypePartner, isLoading, error };
}
