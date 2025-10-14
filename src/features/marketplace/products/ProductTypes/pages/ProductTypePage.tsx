import ProductTypeTable from "../table/ProductTypeTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllProductTypes } from "../hooks/useGetAllProductTypes";
import { ProductType } from "@/types/productType";
import { useProductTypeActions } from "../hooks/useProductTypeActions";
import { useCreateProductType } from "../hooks/useCreateProductType";
import CreateProductTypeModal from "../components/CreateProductTypeModal";
import EditProductTypeModal from "../components/EditProductTypeModal";

const ProductTypePage = () => {
  const { productTypes, isLoading, error, refetch } = useGetAllProductTypes();
  const {
    editProductType,
    deleteProductType,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductTypeActions();
  const {
    createProductType,
    isLoading: isCreating,
    error: createError,
  } = useCreateProductType();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<{
    id: string;
    type: string;
    products: any[]; // This could be more specific if you know the structure of product objects
  } | null>(null);

  const filteredProductTypes = useMemo(() => {
    return productTypes.filter((productType) => {
      const searchContent =
        `${productType.id} ${productType.type}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [productTypes, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedProductType: ProductType) => {
    const result = await editProductType(id, updatedProductType);
    if (result) {
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProductType(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredProductTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProductTypes = filteredProductTypes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (productType: ProductType) => {
    setSelectedProductType(productType);
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
            Product Types
          </p>

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
        <ProductTypeTable
          productTypes={paginatedProductTypes}
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
        <CreateProductTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(type) =>
            createProductType(type, () => {
              refetch();
              setIsModalOpen(false);
            })
          }
        />
        {isEditModalOpen && selectedProductType && (
          <EditProductTypeModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(id, updatedType) =>
              handleEdit(id, {
                ...selectedProductType, // Spread the existing selectedProductType
                type: updatedType, // Update the type or any other field you want to edit
              })
            }
            id={selectedProductType.id}
            initialType={selectedProductType.type}
          />
        )}
      </div>
    </div>
  );
};

export default ProductTypePage;
