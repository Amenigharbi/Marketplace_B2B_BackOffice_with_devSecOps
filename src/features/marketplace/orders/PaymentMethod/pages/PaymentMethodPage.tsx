import PaymentMethodTable from "../table/PaymentMethodTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllMethods } from "../hooks/useGetAllMethod";
import { Methods } from "@/types/Methods";
import { useMethodsActions } from "../hooks/useMethodActions";
import { useCreateMethod } from "../hooks/useCreateMethod";
import CreateMethodModal from "../components/CreateMethodModel";
import EditMethodModal from "../components/EditMethodModel";

const PaymentMethodPage = () => {
  const { Methods, isLoading, error, refetch } = useGetAllMethods();
  const {
    editMethod,
    deleteMethod,
    isLoading: isActionLoading,
    error: actionError,
  } = useMethodsActions();
  const {
    createMethod,
    isLoading: isCreating,
    error: createError,
  } = useCreateMethod();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMethod, setSortMethod] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredMethod = useMemo(() => {
    return Methods.filter((methods) => {
      const searchContent = `${methods.id} ${methods.name} `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [Methods, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  const handleEdit = async (id: string, updatedMethod: Methods) => {
    const result = await editMethod(id, updatedMethod);
    if (result) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMethod(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredMethod.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedState = filteredMethod.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const openEditModal = (id: string, updatedMethod: Methods) => {
    setSelectedMethod({ id, name: updatedMethod.name });
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
          <p className="text-3xl font-bold capitalize text-primary">
            Payment Method
          </p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Rechercher..."
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
              value={sortMethod}
              onChange={(e) =>
                setSortMethod(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56  items-center justify-center  ">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="New State"
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
                <span className="hidden md:inline">New Method</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <PaymentMethodTable
          methods={paginatedState}
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
        <CreateMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(name) =>
            createMethod(name, () => {
              refetch();
              setIsModalOpen(false);
            })
          }
        />
        {isEditModalOpen && selectedMethod && (
          <EditMethodModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(id, name) => handleEdit(id, { id, name })}
            id={selectedMethod.id}
            initialName={selectedMethod.name}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodPage;
