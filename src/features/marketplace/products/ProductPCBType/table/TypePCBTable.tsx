import { FaEdit, FaTrash } from "react-icons/fa";
import { useTypePcbActions } from "../hooks/useTypePCBActions";
import { TypePcb } from "@/types/typePcb";

interface TypePcbTableProps {
  typePcbs: TypePcb[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (typePcb: TypePcb) => void;
  onDelete: (id: string) => void;
  isSidebarOpen: boolean;
}

export default function TypePcbTable({
  typePcbs,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: TypePcbTableProps) {
  const { deleteTypePcb } = useTypePcbActions();

  const handleDelete = (id: string) => {
    deleteTypePcb(id).then(() => refetch());
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-primary">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading PCB types...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-red-600">
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

            {!isLoading && !error && typePcbs?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  <p>No PCB types found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              typePcbs.map((type) => (
                <tr
                  key={type.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {type.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(type)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
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
