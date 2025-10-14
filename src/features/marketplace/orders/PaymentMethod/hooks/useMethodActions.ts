import { useState } from "react";
import axios from "axios";

interface Methods {
  id: string;
  name: string;
}

export function useMethodsActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editMethod = async (id: string, updatedMethods: Methods) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/payment_method/${id}`,
        updatedMethods,
      );
      if (response.status === 200) {
        return response.data.orderPayment;
      }
    } catch (err: any) {
      setError("Failed to update method");
      console.error("Error updating method:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMethod = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/api/marketplace/payment_method/${id}`,
      );
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (err: any) {
      setError("Failed to delete method");
      console.error("Error deleting state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editMethod, deleteMethod, isLoading, error };
}
