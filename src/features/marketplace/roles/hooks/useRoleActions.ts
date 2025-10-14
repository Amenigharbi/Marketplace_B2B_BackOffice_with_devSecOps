import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface Role {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useRoleActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editRole = async (id: string, updatedRole: Partial<Role>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/roles/${id}`,
        updatedRole,
      );
      if (response.status === 200) {
        toast.success("Role updated successfully!");
        return response.data.role;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update role";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/roles/${id}`);
      if (response.status === 200) {
        toast.success("Role deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete role";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting role:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editRole, deleteRole, isLoading, error };
}
