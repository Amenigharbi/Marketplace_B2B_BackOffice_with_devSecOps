import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateProductStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProductStatus = async (
    name: string,
    actif: boolean,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/product_status/create",
        {
          name,
          actif,
        },
      );

      if (response.status === 201) {
        toast.success("Product status created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create product status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProductStatus, isLoading, error };
}
