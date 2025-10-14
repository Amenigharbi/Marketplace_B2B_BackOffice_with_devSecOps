import { useEffect, useState } from "react";
import PromotionTable from "./components/PromotionTable";
import { useRouter } from "next/navigation";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { Promotion } from "./types/promo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import EditPromoForm from "./components/EditPromoForm";
import AdvancedFilters from "./components/AdvancedFilters";

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [deletePromotionId, setDeletePromotionId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const router = useRouter();

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/marketplace/promotion/getAll?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearchTerm}&startDate=${activeFilters.startDate}&endDate=${activeFilters.endDate}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch promotions");
        }

        setPromotions(data.promotions || []);
        setTotalPromotions(data.totalPromotions || 0);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [currentPage, debouncedSearchTerm, activeFilters, itemsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
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

  const totalPages = Math.ceil(totalPromotions / itemsPerPage);

  const handleUpdate = async (updatedPromotion: Promotion) => {
    try {
      const response = await fetch(
        `/api/marketplace/promotion/${updatedPromotion.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promoPrice: updatedPromotion.promoPrice,
            startDate: updatedPromotion.startDate.toISOString(),
            endDate: updatedPromotion.endDate.toISOString(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update promotion");
      }

      setPromotions((prevPromotions) =>
        prevPromotions.map((promotion) =>
          promotion.id === updatedPromotion.id ? updatedPromotion : promotion,
        ),
      );

      toast.success("Promotion updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletePromotionId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletePromotionId) return;

    try {
      const response = await fetch(
        `/api/marketplace/promotion/${deletePromotionId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete promotion");
      }

      setPromotions((prevPromotions) =>
        prevPromotions.filter(
          (promotion) => promotion.id !== deletePromotionId,
        ),
      );

      toast.success("Promotion deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeletePromotionId(null);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
  };

  const handleCloseEdit = () => {
    setEditingPromotion(null);
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
          <div className="box w-full min-w-[1500px] xl:p-8">
            <div className="bb-dashed mb-6 mt-9 flex items-center justify-between pb-6">
              <p className="ml-4 mt-6 text-3xl font-bold text-primary">
                Promotion Management
              </p>
              <div className="flex h-12 items-center justify-center">
                <button
                  onClick={() =>
                    router.push("/marketplace/products/promotion/new")
                  }
                  className="btn flex items-center gap-2 px-3 py-2.5 text-sm"
                  title="New Promotion"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                  <span className="md:inline">New Promotion</span>
                </button>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                <input
                  type="text"
                  placeholder="Search Promotions..."
                  className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  🔍
                </span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded bg-gray-200 px-4 py-2"
                >
                  {showFilters ? "Hide Filters" : "Filters"}
                </button>
              </div>

              {showFilters && (
                <AdvancedFilters
                  onApply={(filters) => {
                    setActiveFilters(filters);
                    setCurrentPage(1);
                  }}
                />
              )}

              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(
                  ([key, value]) =>
                    value && (
                      <span
                        key={key}
                        className="rounded-full bg-gray-100 px-2 py-1 text-sm"
                      >
                        {key}: {value}
                      </span>
                    ),
                )}
              </div>
            </div>

            <div
              className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
              style={{ maxHeight: "600px", width: "100%" }}
            >
              <PromotionTable
                data={promotions}
                loading={loading}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onEdit={handleEdit}
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

      {editingPromotion && (
        <EditPromoForm
          promotion={editingPromotion}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PromotionManagementPage;
