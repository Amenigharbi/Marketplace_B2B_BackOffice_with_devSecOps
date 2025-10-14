import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Source } from "@/types/source";

export function useSourceActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editSource = async (id: string, updatedSource: Partial<Source>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/source/${id}`,
        updatedSource,
      );
      if (response.status === 200) {
        toast.success("Source updated successfully!");
        return response.data.source;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update source";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating source:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSource = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/source/${id}`);
      if (response.status === 200) {
        toast.success("Source deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete source";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting source:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editSource, deleteSource, isLoading, error };
}
