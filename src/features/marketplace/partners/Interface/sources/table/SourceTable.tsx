import { FaEdit, FaTrash } from "react-icons/fa";
import { Source } from "@/types/source";
import { useSourceActions } from "../hooks/useSourceActions";

interface SourceTableProps {
  sources: Source[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (source: Source) => void;
  onDelete: (id: string) => void;
  isSidebarOpen: boolean;
}

export default function SourceTable({
  sources,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: SourceTableProps) {
  const { deleteSource } = useSourceActions();

  const handleDelete = (id: string) => {
    deleteSource(id).then(() => refetch());
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-4 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading sources...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-red-600">
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

            {!isLoading && !error && sources.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  <p>No sources found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              sources.map((source) => (
                <tr
                  key={source.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {source.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(source)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="mx-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
