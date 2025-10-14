import { FaEdit, FaTrash } from "react-icons/fa";
import { Role } from "@/types/role";
import { useRoleActions } from "../hooks/useRoleActions";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  isSidebarOpen: boolean;
}

export default function RoleTable({
  roles,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: RoleTableProps) {
  const { deleteRole } = useRoleActions();

  const handleDelete = (id: string) => {
    deleteRole(id).then(() => refetch());
  };

  const isKamiounAdminMaster = (roleName: string) =>
    roleName === "KamiounAdminMaster";

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading roles...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-red-600">
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && roles.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  <p>No roles found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {role.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {!isKamiounAdminMaster(role.name) ? (
                      <>
                        <button
                          onClick={() => onEdit(role)}
                          className="mx-2 text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="mx-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Protected Role
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
