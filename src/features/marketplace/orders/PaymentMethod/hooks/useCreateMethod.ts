import { useState } from "react";
import axios from "axios";

export function useCreateMethod() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMethod = async (name: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/marketplace/payment_method/create",
        {
          name,
        },
      );
      if (response.status === 201) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError("Erreur lors de la création du méthode");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createMethod, isLoading, error };
}
