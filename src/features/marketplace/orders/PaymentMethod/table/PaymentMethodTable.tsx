import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMethodsActions } from "../hooks/useMethodActions";

interface Methods {
  id: string;
  name: string;
}

interface PaymentMethodTableProps {
  methods: Methods[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isSidebarOpen: boolean;
  onEdit: (id: string, updatedMethod: Methods) => void;
  onDelete: (id: string) => void;
}

export default function PaymentMethodTable({
  methods,
  isLoading,
  error,
  refetch,
  isSidebarOpen,
  onEdit,
  onDelete,
}: PaymentMethodTableProps) {
  const { editMethod, deleteMethod } = useMethodsActions();

  const handleEdit = (id: string, updatedMethod: Methods) => {
    editMethod(id, updatedMethod).then(() => {
      refetch();
    });
  };

  const handleDelete = (id: string) => {
    deleteMethod(id).then(() => {
      refetch();
    });
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: "100%" }}
        >
          <thead className="border-b border-gray-100 bg-primary">
            <tr>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                ID
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Name
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-600" colSpan={3}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Chargement des états...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td className="px-4 py-4 text-center text-red-600" colSpan={3}>
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Réessayer
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && methods?.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={3}>
                  <p>
                    Aucune méthode de payment ne correspond à vos critères de
                    recherche.
                  </p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              methods?.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="break-words px-4 py-2 text-center text-sm text-gray-900">
                    {item.id}
                  </td>
                  <td className="break-words px-4 py-2 text-center text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        onEdit(item.id, { id: item.id, name: item.name })
                      }
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
