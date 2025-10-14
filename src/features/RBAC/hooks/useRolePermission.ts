import { useEffect, useState } from "react";
import { RolePermission } from "@/typesrbac";

export const useRolePermissions = () => {
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/marketplace/role-permissions/getAll")
      .then((res) => res.json())
      .then((data) => setRolePermissions(data.roles));
  }, []);

  const getPermissionsForRole = (roleId: string) => {
    const role = rolePermissions.find((r) => r.id === roleId);
    return role ? role.permissions : [];
  };

  return { rolePermissions, getPermissionsForRole };
};
