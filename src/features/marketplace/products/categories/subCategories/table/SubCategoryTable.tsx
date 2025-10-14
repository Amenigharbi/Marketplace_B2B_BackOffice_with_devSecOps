// components/SubCategoryTable.tsx
import { SubCategory } from "@/types/subCategory";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSubCategoryActions } from "../hooks/useSubCategoryActions";

interface SubCategoryTableProps {
  subcategories: SubCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (id: string) => Promise<void>;
  isSidebarOpen: boolean;
}

export default function SubCategoryTable({
  subcategories,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
  isSidebarOpen,
}: SubCategoryTableProps) {
  const { deleteSubCategory } = useSubCategoryActions();

  const handleDelete = (id: string) => {
    deleteSubCategory(id).then(() => refetch());
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <table className="w-full">
        <thead className="border-b bg-primary">
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading && (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-blue-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2">Loading subcategories...</p>
                </div>
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td
                colSpan={5}
                className="bg-red-50 px-4 py-4 text-center text-red-600"
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
          {!isLoading && !error && subcategories?.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                <p>No subcategories found.</p>
              </td>
            </tr>
          )}
          {!isLoading &&
            !error &&
            subcategories.map((subcategory) => (
              <tr
                key={subcategory.id}
                className="transition-colors duration-150 hover:bg-blue-50"
              >
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {subcategory.name}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      subcategory.isActive
                        ? "border border-green-300 bg-green-100 text-green-700"
                        : "border border-red-300 bg-red-100 text-red-700"
                    }`}
                  >
                    {subcategory.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {subcategory.image ? (
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="mx-auto h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-200"></div>
                  )}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {subcategory.createdAt
                    ? new Date(subcategory.createdAt).toLocaleDateString()
                    : "No date available"}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(subcategory)}
                    className="mx-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory.id)}
                    className="mx-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
