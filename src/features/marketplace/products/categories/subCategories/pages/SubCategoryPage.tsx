import { useState, useEffect, useMemo, useCallback } from "react";
import SubCategoryTable from "../table/SubCategoryTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../../shared/elements/Pagination/Pagination";
import { SubCategory } from "@/types/subCategory";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";
import { useRouter } from "@/libs/next-intl/i18nNavigation";
import CreateSubCategoryModal from "../components/CreateSubCategoryModal";
import { useCreateSubCategory } from "../hooks/useCreateSubCategory";
import EditSubCategoryModal from "../components/EditSubCategoryModal";

const SubCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);

  const {
    createSubCategory,
    isLoading: isCreating,
    error: createError,
  } = useCreateSubCategory();
  const { editSubCategory, deleteSubCategory } = useSubCategoryActions();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!categoryId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/marketplace/category/${categoryId}`);
      if (!res.ok) throw new Error("Failed to fetch category");

      const data = await res.json();
      setCategoryName(data.category?.nameCategory || "");
      setSubcategories(data.category?.subCategories || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching category:", err);
      setError("Failed to fetch category data.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("categoryId");
    setCategoryId(id);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSubCategories = useMemo(() => {
    return subcategories
      .filter((subcategory) => {
        const content = `${subcategory.id} ${subcategory.name}`.toLowerCase();
        return content.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return sortState === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [subcategories, searchTerm, sortState]);

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCreateSubCategory = async (subCategoryData: {
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => {
    try {
      await createSubCategory(subCategoryData, () => {
        setIsModalOpen(false);
        fetchData();
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  const handleEditSubCategory = async (updatedData: {
    id: string;
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => {
    try {
      const { id, ...updateData } = updatedData;
      await editSubCategory(id, updateData);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubCategory(id);
      setSubcategories((prev) => prev.filter((sc) => sc.id !== id));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const openEditModal = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
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
          <p className="text-xl font-bold capitalize">
            Subcategories of {categoryName}
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
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <SubCategoryTable
            subcategories={paginatedSubCategories}
            isLoading={isLoading}
            error={error}
            refetch={fetchData}
            isSidebarOpen={false}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
        {createError && <p className="mt-2 text-red-500">{createError}</p>}
      </div>

      <Divider />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <CreateSubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSubCategory}
        categoryId={categoryId}
      />

      {isEditModalOpen && selectedSubcategory && (
        <EditSubCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditSubCategory}
          initialData={selectedSubcategory}
          categoryId={categoryId}
        />
      )}
    </div>
  );
};

export default SubCategoryPage;
