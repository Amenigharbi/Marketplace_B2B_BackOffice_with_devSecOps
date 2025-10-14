import { useState } from "react";
import axios from "axios";
import { RolePermission } from "@/types/rbac";

export function useCreateRolePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRolePermission = async (
    rolePermissionData: Omit<RolePermission, "id">,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(rolePermissionData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await axios.post(
        "/api/marketplace/role_permissions/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        return response.data.rolePermission;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create role permission");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createRolePermission, isLoading, error };
}
