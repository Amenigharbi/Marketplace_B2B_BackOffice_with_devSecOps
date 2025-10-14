import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useCreateState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createState = async (name: string) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Creating state...", {
      position: "top-center",
      autoClose: false,
    });

    try {
      const response = await axios.post("/api/marketplace/state/create", {
        name,
      });

      toast.update(toastId, {
        render: "State created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to create state";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      throw err; // Important pour propager l'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return { createState, isLoading, error };
}
