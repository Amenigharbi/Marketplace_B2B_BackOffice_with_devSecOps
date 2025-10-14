import StatusTable from "../table/statusTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllStatus } from "../hooks/useGetAllStatus";
import { Status } from "@/types/status";
import { useStatusActions } from "../hooks/useStatusActions";
import { useCreateStatus } from "../hooks/useCreateStatus";
import CreateStatusModal from "../components/CreateStatusModal";
import { State } from "@/types/state";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StatusPage = () => {
  const { status, isLoading, error, refetch } = useGetAllStatus();
  const editStatus = useStatusActions();
  const {
    createStatus,
    isLoading: isCreating,
    error: createError,
  } = useCreateStatus();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortStatus, setSortStatus] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/marketplace/state/getAll")
      .then((res) => res.json())
      .then((data) => setStates(data.states || []));
  }, []);

  const filteredAndSortedStatus = useMemo(() => {
    let result = status.filter((status) => {
      const searchContent =
        `${status.id} ${status.name} ${status.stateId}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    if (sortStatus === "newest") {
      result = result.slice().sort((a, b) => b.id.localeCompare(a.id));
    } else {
      result = result.slice().sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [status, searchTerm, sortStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedStatus: Status) => {
    const result = await editStatus.editStatus(id, updatedStatus);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredAndSortedStatus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStatus = filteredAndSortedStatus.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "70px",
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
          <p className="text-xl font-bold capitalize">Status</p>

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
              value={sortStatus}
              onChange={(e) =>
                setSortStatus(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-56  items-center justify-center  ">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="New Status"
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
                <span className="hidden md:inline">New Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <StatusTable
          status={paginatedStatus}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={handleEdit}
          states={states}
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
        <CreateStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(name, stateId) =>
            createStatus(name, stateId, () => {
              refetch();
              setIsModalOpen(false);
            })
          }
        />
      </div>
    </div>
  );
};

export default StatusPage;
