import RolePermissionMatrix from "@/features/marketplace/role-permissions/RolePermissionMatrix";

export default function RolePermissionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
          Role Permissions Matrix
        </h1>
      </div>
      <RolePermissionMatrix />
    </div>
  );
}
