import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateProductType() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProductType = async (type: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/product_type/create",
        {
          type,
        },
      );
      if (response.status === 201) {
        toast.success("Product type created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create product type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProductType, isLoading, error };
}
