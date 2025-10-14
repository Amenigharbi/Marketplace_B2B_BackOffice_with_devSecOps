import { FaEdit, FaTrash, FaList } from "react-icons/fa";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
  isSidebarOpen: boolean;
  onViewSubcategories: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
  onViewSubcategories,
}: CategoryTableProps) {
  const { deleteCategory } = useCategoryActions();

  const handleDelete = (id: string) => {
    deleteCategory(id).then(() => refetch());
  };

  return (
    <div className="mt-5 rounded-lg bg-primary/5 dark:bg-bg3">
      <table className="min-w-full">
        <thead className="sticky top-0 border-b border-gray-100 bg-primary">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Image
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Created At
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Sub-categories
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-lg text-gray-600">Loading categories...</p>
                </div>
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-lg text-red-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <p>{error}</p>
                  <button
                    onClick={refetch}
                    className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              </td>
            </tr>
          )}

          {!isLoading && !error && categories?.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-lg text-gray-500"
              >
                <p>No categories found.</p>
              </td>
            </tr>
          )}

          {!isLoading &&
            !error &&
            categories.map((category) => (
              <tr
                key={category.id}
                className="group transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {category.nameCategory}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.nameCategory}
                      className="mx-auto h-16 w-16 rounded-full border border-gray-200 object-cover shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/64x64?text=No+Image";
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/64x64?text=No+Image"
                      alt="No image"
                      className="mx-auto h-16 w-16 rounded-full border border-gray-200 object-cover shadow-sm"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "No date available"}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {category.subCategories.length}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewSubcategories(category)}
                      className="rounded-full p-2 text-green-500 transition hover:text-green-700"
                      title="View Subcategories"
                    >
                      <FaList />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className="rounded-full p-2 text-blue-500 transition hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="rounded-full p-2 text-red-500 transition hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
