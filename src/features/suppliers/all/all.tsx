import { useEffect, useState } from "react";
import PurchaseTable from "../components/PurchaseTable/PurchaseTable";
import usePurchaseStore from "../stores/purchaseStore";
import AdvancedFilters from "../components/AdvancedFilters/AdvancedFiltersAll";
import { useRouter } from "next/navigation";
import Pagination from "../../shared/elements/Pagination/Pagination";
const SupplierPurchasesPage = () => {
  const { purchases, loading, error, fetchPurchases, total } =
    usePurchaseStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPurchases(currentPage, itemsPerPage, {
          search: debouncedSearchTerm,
          ...activeFilters,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, activeFilters]);
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

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="flex h-full flex-grow">
      <div className="h-full w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
        <div className="relative grid h-full w-full items-center justify-center gap-4">
          <div className="box w-full min-w-[800px] xl:p-8">
            <div className="bb-dashed mb-6 flex items-center justify-between pb-6">
              <p className="ml-4 text-xl font-bold">Supplier Orders</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
                  <div className="flex h-16 w-56  items-center justify-center  ">
                    <button
                      onClick={() => router.push("/suppliers/new")}
                      className="btn"
                      title="New supplier"
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
                      <span className="hidden md:inline">New Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 space-y-4">
              <div className="flex gap-2">
                <input
                  placeholder="Search (Order ID, Supplier, Warehouse)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 rounded border p-2"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    setDebouncedSearchTerm(searchTerm.toLowerCase())
                  }
                />
                <button
                  onClick={() =>
                    setDebouncedSearchTerm(searchTerm.toLowerCase())
                  }
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                  🔍
                </button>
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
              style={{ maxHeight: "600px" }}
            >
              <PurchaseTable data={purchases} loading={loading} />
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
    </div>
  );
};

export default SupplierPurchasesPage;
