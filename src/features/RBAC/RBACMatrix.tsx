"use client";

import { useState, useEffect } from "react";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import { toast } from "react-hot-toast";
import { FiCheck, FiX, FiSave } from "react-icons/fi";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  actions: string[];
  role: Role;
  permission: Permission;
}

interface SelectedPermission {
  roleId: string;
  permissionId: string;
  action: string;
  currentState: boolean;
}

export default function RolePermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<
    SelectedPermission[]
  >([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const { sidebarIsOpen } = useGlobalStore();
  const availableActions: string[] = ["create", "read", "update", "delete"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
        fetch("/api/marketplace/roles/getAll"),
        fetch("/api/marketplace/permissions/getAll"),
        fetch("/api/marketplace/role_permissions/getAll"),
      ]);

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();
      const rolePermissionsData = await rolePermissionsRes.json();

      setRoles(rolesData.roles);
      setPermissions(permissionsData.permissions);
      setRolePermissions(rolePermissionsData.rolePermissions);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setIsLoading(false);
    }
  };

  const getRolePermission = (roleId: string, permissionId: string) => {
    return rolePermissions.find(
      (rp) => rp.roleId === roleId && rp.permissionId === permissionId,
    );
  };

  const handleActionToggle = async (
    roleId: string,
    permissionId: string,
    action: string,
    existingRolePermission?: RolePermission,
  ) => {
    try {
      let newActions: string[];
      let method: string;
      let url: string;
      let body: {
        roleId: string;
        permissionId: string;
        actions: string[];
      };

      if (existingRolePermission) {
        newActions = existingRolePermission.actions.includes(action)
          ? existingRolePermission.actions.filter((a) => a !== action)
          : [...existingRolePermission.actions, action];

        method = "PATCH";
        url = `/api/marketplace/role_permissions/${existingRolePermission.id}`;
        body = {
          roleId,
          permissionId,
          actions: newActions,
        };
      } else {
        newActions = [action];
        method = "POST";
        url = "/api/marketplace/role_permissions/create";
        body = {
          roleId,
          permissionId,
          actions: newActions,
        };
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update permissions");

      await fetchData();
      toast.success("Permissions updated successfully");
    } catch (err) {
      toast.error("Failed to update permissions");
      console.error(err);
    }
  };

  const handleCheckboxClick = (
    roleId: string,
    permissionId: string,
    action: string,
    currentState: boolean,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();

    if (isSelectionMode) {
      const selectionKey = `${roleId}-${permissionId}-${action}`;
      const existingIndex = selectedPermissions.findIndex(
        (p) =>
          p.roleId === roleId &&
          p.permissionId === permissionId &&
          p.action === action,
      );

      if (existingIndex >= 0) {
        setSelectedPermissions((prev) =>
          prev.filter((_, index) => index !== existingIndex),
        );
      } else {
        setSelectedPermissions((prev) => [
          ...prev,
          {
            roleId,
            permissionId,
            action,
            currentState,
          },
        ]);
      }
    } else {
      handleActionToggle(
        roleId,
        permissionId,
        action,
        getRolePermission(roleId, permissionId),
      );
    }
  };

  interface GroupedSelection {
    roleId: string;
    permissionId: string;
    actions: string[];
    currentState: boolean;
    existingRolePermission: RolePermission | undefined;
  }

  const handleBatchSave = async () => {
    try {
      const groupedSelections = selectedPermissions.reduce<
        Record<string, GroupedSelection>
      >((acc, selection) => {
        const key = `${selection.roleId}-${selection.permissionId}`;
        if (!acc[key]) {
          acc[key] = {
            roleId: selection.roleId,
            permissionId: selection.permissionId,
            actions: [],
            currentState: selection.currentState,
            existingRolePermission: getRolePermission(
              selection.roleId,
              selection.permissionId,
            ),
          };
        }
        acc[key].actions.push(selection.action);
        return acc;
      }, {});

      const promises = Object.values(groupedSelections).map((group) => {
        const { roleId, permissionId, actions, existingRolePermission } = group;
        let method: string;
        let url: string;
        let newActions: string[];

        if (existingRolePermission) {
          const currentActions = new Set(existingRolePermission.actions);
          actions.forEach((action: string) => {
            if (currentActions.has(action)) {
              currentActions.delete(action);
            } else {
              currentActions.add(action);
            }
          });
          newActions = Array.from(currentActions);

          method = "PATCH";
          url = `/api/marketplace/role_permissions/${existingRolePermission.id}`;
        } else {
          newActions = actions;
          method = "POST";
          url = "/api/marketplace/role_permissions/create";
        }

        return fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roleId,
            permissionId,
            actions: newActions,
          }),
        });
      });

      await Promise.all(promises);
      await fetchData();
      setSelectedPermissions([]);
      setIsSelectionMode(false);
      toast.success(" permissions updated  successfully");
    } catch (err) {
      toast.error("Failed to update  permissions");
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
        <FiX className="mr-2 inline-block" />
        {error}
      </div>
    );

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <button
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedPermissions([]);
          }}
          className={`btn ${
            isSelectionMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-primary-primary-900 text-white hover:bg-primary-600"
          }`}
        >
          {isSelectionMode ? (
            <>
              <FiX className="h-4 w-4" />
              Cancel Multiple Select
            </>
          ) : (
            <>
              <FiCheck className="h-4 w-4" />
              Multiple Select
            </>
          )}
        </button>

        {isSelectionMode && selectedPermissions.length > 0 && (
          <button onClick={handleBatchSave} className="btn bg-blue-600">
            <FiSave className="h-4 w-4" />
            Save Changes ({selectedPermissions.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="max-w-full ">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="sticky left-0 z-10 bg-primary from-gray-50 to-gray-100 px-6 py-4">
                  <div className="text-left text-sm font-semibold text-white">
                    Roles
                  </div>
                </th>
                {permissions.map((permission) => (
                  <th
                    key={permission.id}
                    className="border-b border-l border-gray-200 bg-primary px-6 py-4"
                  >
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-white">
                        {permission.resource}
                      </div>
                      <div className="flex items-center justify-center space-x-6">
                        {availableActions.map((action) => (
                          <div
                            key={action}
                            className="flex flex-col items-center"
                          >
                            <span className="text-xs font-medium capitalize text-white">
                              {action}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles
                .filter((role) => role.name !== "KamiounAdminMaster")
                .map((role) => (
                  <tr
                    key={role.id}
                    className="transition-all duration-200 hover:bg-blue-50"
                  >
                    <td className="sticky left-0 z-10 whitespace-nowrap border-r border-gray-200 bg-white px-6 py-4 font-medium text-gray-900 hover:bg-blue-50">
                      {role.name}
                    </td>
                    {permissions.map((permission) => {
                      const rolePermission = getRolePermission(
                        role.id,
                        permission.id,
                      );
                      return (
                        <td
                          key={`${role.id}-${permission.id}`}
                          className="border-l border-gray-200 px-6 py-4"
                        >
                          <div className="flex items-center justify-center space-x-6">
                            {availableActions.map((action) => {
                              const isSelected = selectedPermissions.some(
                                (p) =>
                                  p.roleId === role.id &&
                                  p.permissionId === permission.id &&
                                  p.action === action,
                              );
                              const isChecked =
                                rolePermission?.actions.includes(action) ??
                                false;

                              return (
                                <label
                                  key={action}
                                  className={`relative inline-flex flex-col items-center gap-1 ${
                                    isSelectionMode && isSelected
                                      ? "rounded-lg p-1 ring-2 ring-blue-500"
                                      : ""
                                  }`}
                                  title={`${action} permission`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    onClick={(e) =>
                                      handleCheckboxClick(
                                        role.id,
                                        permission.id,
                                        action,
                                        isChecked,
                                        e,
                                      )
                                    }
                                    className="h-5 w-5 rounded-md border-2 border-gray-300 
                                           text-blue-600 transition-all duration-200 
                                           ease-in-out hover:border-blue-400
                                           focus:border-blue-300 focus:ring-2 focus:ring-blue-200
                                           focus:ring-opacity-50"
                                  />
                                  {isChecked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <FiCheck className="h-3 w-3 text-blue-600" />
                                    </div>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
