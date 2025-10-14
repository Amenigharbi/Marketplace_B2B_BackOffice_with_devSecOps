import { useState } from "react";
import axios from "axios";

interface Status {
  id: string;
  name: string;
  stateId: string;
}

export function useStatusActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editStatus = async (id: string, updatedStatus: Status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/status/${id}`,
        updatedStatus,
      );
      if (response.status === 200) {
        // Handle success (optional: you can return the updated status)
        return response.data.status;
      }
    } catch (err: any) {
      setError("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return { editStatus, isLoading, error };
}
