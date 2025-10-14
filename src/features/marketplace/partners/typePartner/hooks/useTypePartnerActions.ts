import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface TypePartner {
  id: string;
  name: string;
  partners: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function useTypePartnerActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTypePartner = async (
    id: string,
    updatedTypePartner: TypePartner,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`/api/marketplace/typePartner/${id}`, {
        name: updatedTypePartner.name,
      });
      if (response.status === 200) {
        toast.success("Partner type updated successfully!");
        return response.data.typePartner;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update partner type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating type partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTypePartner = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/typePartner/${id}`);
      if (response.status === 200) {
        toast.success("Partner type deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete partner type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting type partner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editTypePartner, deleteTypePartner, isLoading, error };
}
