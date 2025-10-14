import { useState } from "react";
import axios, { AxiosError } from "axios";
import { RolePermission } from "@/types/rbac";

export function useRolePermissionActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editRolePermission = async (
    id: string,
    updatedrolePermission: Partial<RolePermission>,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.patch(
        `/api/marketplace/role_permissions/${id}`,
        updatedrolePermission,
      );

      if (response.status === 200) {
        setSuccessMessage("role permission updated successfully!");
        return true; // ✅ Changement ici
      } else {
        return false;
      }
    } catch (err: AxiosError | any) {
      console.error("Error editing role permission:", err);
      setError(err.response?.data?.error || "Failed to edit customer");
      return false; // ✅ retourne false en cas d’erreur
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRolePermission = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/api/marketplace/role_permissions/${id}`,
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

  return {
    editRolePermission,
    deleteRolePermission,
    isLoading,
    error,
    successMessage,
  };
}
