import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateTypePcb() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTypePcb = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/marketplace/type_pcb/create", {
        name,
      });

      if (response.status === 201) {
        toast.success("PCB type created successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create PCB type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating PCB type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTypePcb, isLoading, error };
}
