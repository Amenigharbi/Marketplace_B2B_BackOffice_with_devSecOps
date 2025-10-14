import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface TypePcb {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useTypePcbActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTypePcb = async (id: string, updatedTypePcb: Partial<TypePcb>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/type_pcb/${id}`,
        updatedTypePcb,
      );
      if (response.status === 200) {
        toast.success("PCB type updated successfully!");
        return response.data.typePcb;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update PCB type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating PCB type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypePcb = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/type_pcb/${id}`);
      if (response.status === 200) {
        toast.success("PCB type deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete PCB type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting PCB type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editTypePcb, deleteTypePcb, isLoading, error };
}
