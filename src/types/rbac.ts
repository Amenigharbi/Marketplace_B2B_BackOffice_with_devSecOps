// types/rbac.d.ts
export interface Role {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  resource: string;
  action: "read" | "create" | "update" | "delete";
  createdAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  actions: ("read" | "create" | "update" | "delete")[];
  createdAt: Date;
}
