import StateTable from "../table/stateTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllStates } from "../hooks/useGetAllStates";
import { State } from "@/types/state";
import { useStateActions } from "../hooks/useStateActions";
import { useCreateState } from "../hooks/useCreateState";
import CreateStateModal from "../components/CreateStateModal";
import EditStateModal from "../components/EditStateModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StatePage = () => {
  const { state, isLoading, error, refetch } = useGetAllStates();
  const editState = useStateActions();
  const createState = useCreateState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredAndSortedState = useMemo(() => {
    let result = state.filter((s) => {
      const searchContent = `${s.id} ${s.name}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    if (sortState === "newest") {
      result = result.slice().sort((a, b) => b.id.localeCompare(a.id));
    } else {
      result = result.slice().sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [state, searchTerm, sortState]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  const handleEdit = async (id: string, updatedState: State) => {
    const result = await editState.editState(id, updatedState);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredAndSortedState.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedState = filteredAndSortedState.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const openEditModal = (id: string, updatedState: State) => {
    setSelectedState({ id, name: updatedState.name });
    setIsEditModalOpen(true);
  };
  const handleCreateState = async (name: string) => {
    try {
      await createState.createState(name);
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
    }
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
      <ToastContainer position="top-center" autoClose={5000} />

      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-bold capitalize">State</p>

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
              value={sortState}
              onChange={(e) =>
                setSortState(e.target.value as "newest" | "oldest")
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
                <span className="hidden md:inline">New State</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <StateTable
          state={paginatedState}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={openEditModal}
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
        <CreateStateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateState}
        />
        {isEditModalOpen && selectedState && (
          <EditStateModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(id, name) => handleEdit(id, { id, name })}
            id={selectedState.id}
            initialName={selectedState.name}
          />
        )}
      </div>
    </div>
  );
};

export default StatePage;
