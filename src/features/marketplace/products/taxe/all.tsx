import { useEffect, useState } from "react";
import TaxTable from "./components/TaxTable";
import { useRouter } from "next/navigation";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { Tax } from "./types/tax";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const TaxManagementPage = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalTaxes, setTotalTaxes] = useState(0);
  const [deleteTaxId, setDeleteTaxId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const router = useRouter();

  useEffect(() => {
    const fetchTaxes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/marketplace/tax/getAll?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearchTerm}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch taxes");
        }

        setTaxes(data.taxes || []);
        setTotalTaxes(data.totalTaxes || 0);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTaxes();
  }, [currentPage, debouncedSearchTerm, itemsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalTaxes / itemsPerPage);

  const handleUpdate = async (updatedTax: Tax) => {
    try {
      const response = await fetch(`/api/marketplace/tax/${updatedTax.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: updatedTax.value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update tax");
      }

      setTaxes((prevTaxes) =>
        prevTaxes.map((tax) => (tax.id === updatedTax.id ? updatedTax : tax)),
      );

      toast.success("Tax updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTaxId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTaxId) return;

    try {
      const response = await fetch(`/api/marketplace/tax/${deleteTaxId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete tax");
      }

      setTaxes((prevTaxes) =>
        prevTaxes.filter((tax) => tax.id !== deleteTaxId),
      );

      toast.success("Tax deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeleteTaxId(null);
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
        marginTop: "60px",
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
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[1400px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center justify-between pb-6">
              <p className="ml-4 mt-6 text-xl font-bold">Tax Management</p>
              <div className="flex h-16 w-56  items-center justify-center  ">
                <button
                  onClick={() => router.push("/marketplace/products/taxe/new")}
                  className="btn"
                  title="New Taxe"
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
                  <span className="hidden md:inline">New Taxe</span>
                </button>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                <input
                  type="text"
                  placeholder="Search Taxes by value..."
                  className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  🔍
                </span>
              </div>
            </div>

            <div
              className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
              style={{ maxHeight: "600px", width: "100%" }}
            >
              <TaxTable
                data={taxes}
                loading={loading}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>

            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TaxManagementPage;
