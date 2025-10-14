import CategoryTable from "../table/CategoryTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllCategories } from "../hooks/useGetAllCategories";
import { Category } from "@/types/category";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useCreateCategory } from "../hooks/useCreateCategory";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import { SubCategory } from "@/types/subCategory";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

const CategoryPage = () => {
  const { categories, isLoading, error, refetch } = useGetAllCategories();

  const {
    editCategory,
    deleteCategory,
    isLoading: isActionLoading,
    error: actionError,
  } = useCategoryActions();
  const {
    createCategory,
    isLoading: isCreating,
    error: createError,
  } = useCreateCategory();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [selectedSubcategories, setSelectedSubcategories] = useState<
    SubCategory[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const router = useRouter();
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchContent =
        `${category.id} ${category.nameCategory}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [categories, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedCategory: Partial<Category>) => {
    try {
      const result = await editCategory(id, updatedCategory);
      if (result) {
        refetch();
      }
    } catch (error) {}
  };

  const handleViewSubcategories = (category: Category) => {
    router.push(
      `/marketplace/products/categories/${category.id}?categoryId=${category.id}`,
    );
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
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
          <p className="text-xl font-bold capitalize">Categories</p>
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
        <CategoryTable
          categories={paginatedCategories}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          isSidebarOpen={false}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onViewSubcategories={handleViewSubcategories}
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
        <CreateCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(categoryData) => {
            createCategory(categoryData, () => {
              refetch();
              setIsModalOpen(false);
            });
          }}
        />
        {isEditModalOpen && selectedCategory && (
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(updatedCategory) => {
              handleEdit(updatedCategory.id, updatedCategory);
              setIsEditModalOpen(false);
            }}
            initialData={selectedCategory}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
