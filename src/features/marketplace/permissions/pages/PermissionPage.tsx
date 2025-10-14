import PermissionTable from "../table/PermissionTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllPermissions } from "../hooks/useGetAllPermissions";
import { usePermissionActions } from "../hooks/usePermissionActions";
import { useCreatePermission } from "../hooks/useCreatePermission";
import CreatePermissionModal from "../components/CreatePermissionModal";
import EditPermissionModal from "../components/EditPermissionModal";
import { Permission } from "@/types/permission";

const PermissionPage = () => {
  const { permissions, isLoading, error, refetch } = useGetAllPermissions();
  const {
    editPermission,
    deletePermission,
    isLoading: isActionLoading,
    error: actionError,
  } = usePermissionActions();
  const {
    createPermission,
    isLoading: isCreating,
    error: createError,
  } = useCreatePermission();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      const searchContent =
        `${permission.id} ${permission.resource}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [permissions, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedPermission: Permission) => {
    const result = await editPermission(id, updatedPermission);
    if (result) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deletePermission(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold capitalize">Permissions</p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-2 flex items-center">
                🔍
              </span>
            </div>

            <label htmlFor="sort" className="mr-2 whitespace-nowrap font-bold">
              Sort by:
            </label>
            <select
              id="sort"
              className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortState}
              onChange={(e) =>
                setSortState(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56 items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="Add new"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                <span className="hidden md:inline">Add new</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <PermissionTable
          permissions={paginatedPermissions}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>
      <Divider />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
        <CreatePermissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(permission) =>
            createPermission(permission, () => {
              refetch();
              setIsModalOpen(false);
            })
          }
        />
        {isEditModalOpen && selectedPermission && (
          <EditPermissionModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(id, updatedPermission) =>
              handleEdit(id, {
                ...selectedPermission,
                ...updatedPermission,
              })
            }
            id={selectedPermission.id}
            initialResource={selectedPermission.resource}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionPage;
