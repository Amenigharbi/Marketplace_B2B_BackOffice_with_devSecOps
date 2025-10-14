import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function useCreateStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStatus = async (
    name: string,
    stateId: string,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Creating status...");

    try {
      const response = await axios.post("/api/marketplace/status/create", {
        name,
        stateId,
      });

      if (response.status === 201) {
        toast.update(toastId, {
          render: "Status created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        onSuccess?.();
      }
    } catch (err: any) {
      let errorMessage = "Failed to create status";

      if (err.response) {
        // Erreur venant du serveur
        errorMessage = err.response.data?.error || err.response.statusText;
      } else if (err.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        errorMessage = "No response from server";
      } else {
        // Erreur lors de la configuration de la requête
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { createStatus, isLoading, error };
}
