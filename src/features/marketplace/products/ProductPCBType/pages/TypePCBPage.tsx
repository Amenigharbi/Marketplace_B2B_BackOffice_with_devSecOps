import TypePCBTable from "../table/TypePCBTable"; // Table component for displaying TypePCBs
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllTypePcbs } from "../hooks/useGetAllTypePCBs"; // Custom hook for fetching all TypePCBs
import { TypePcb } from "@/types/typePcb"; // Type for TypePcb
import { useTypePcbActions } from "../hooks/useTypePCBActions"; // Custom hook for handling edit and delete actions
import { useCreateTypePcb } from "../hooks/useCreateTypePCB";
import CreateTypePCBModal from "../components/CreateTypePCBModal"; // Modal for creating a new TypePCB

import EditTypePCBModal from "../components/EditTypePCBModal"; // Modal for editing a TypePCB

const TypePCBPage = () => {
  // Fetching the list of TypePCBs and managing loading/error state
  const { typePcbs, isLoading, error, refetch } = useGetAllTypePcbs();

  // Handling edit and delete actions for TypePCBs
  const {
    editTypePcb,
    deleteTypePcb,
    isLoading: isActionLoading,
    error: actionError,
  } = useTypePcbActions();

  // Handling the creation of new TypePCBs
  const {
    createTypePcb,
    isLoading: isCreating,
    error: createError,
  } = useCreateTypePcb();

  // Managing state for pagination, search, and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");

  // Modals for creating and editing TypePCBs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTypePcb, setSelectedTypePcb] = useState<TypePcb | null>(null);

  // Memoizing the filtered TypePCBs based on search term
  const filteredTypePcbs = useMemo(() => {
    return typePcbs.filter((typePcb) => {
      const searchContent = `${typePcb.id} ${typePcb.name}`.toLowerCase(); // Filter by id and name
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [typePcbs, searchTerm]);

  // Handling page change and reset pagination when items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Handle editing a TypePCB
  const handleEdit = async (id: string, updatedTypePcb: TypePcb) => {
    const result = await editTypePcb(id, updatedTypePcb);
    if (result) {
      refetch(); // Refetch data after update
    }
  };

  // Handle deleting a TypePCB
  const handleDelete = async (id: string) => {
    const result = await deleteTypePcb(id);
    if (result) {
      refetch(); // Refetch data after deletion
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTypePcbs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTypePcbs = filteredTypePcbs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Open the edit modal with selected TypePCB
  const openEditModal = (typePcb: TypePcb) => {
    setSelectedTypePcb(typePcb);
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
          <p className="text-3xl font-bold capitalize text-primary">Type PCB</p>
          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end ">
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
        <TypePCBTable
          typePcbs={paginatedTypePcbs}
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
        <CreateTypePCBModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(type) =>
            createTypePcb(type, () => {
              refetch();
              setIsModalOpen(false);
            })
          }
        />
        {isEditModalOpen && selectedTypePcb && (
          <EditTypePCBModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(id, updatedType) =>
              handleEdit(id, { ...selectedTypePcb, name: updatedType })
            }
            id={selectedTypePcb.id}
            initialName={selectedTypePcb.name}
          />
        )}
      </div>
    </div>
  );
};

export default TypePCBPage;
