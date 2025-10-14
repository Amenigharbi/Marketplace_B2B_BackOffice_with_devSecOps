import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTypePartnerActions } from "../hooks/useTypePartnerActions";

interface TypePartner {
  id: string;
  name: string;
  partners: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface TypePartnerTableProps {
  typePartners: TypePartner[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isSidebarOpen: boolean;
  onEdit: (id: string, updatedTypePartner: TypePartner) => void;
  onDelete: (id: string) => void;
}

export default function TypePartnerTable({
  typePartners,
  isLoading,
  error,
  refetch,
  isSidebarOpen,
  onEdit,
  onDelete,
}: TypePartnerTableProps) {
  const { editTypePartner, deleteTypePartner } = useTypePartnerActions();

  const handleEdit = (id: string, updatedTypePartner: TypePartner) => {
    editTypePartner(id, updatedTypePartner).then(() => {
      refetch();
    });
  };

  const handleDelete = (id: string) => {
    deleteTypePartner(id).then(() => {
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
              <th className="px-6 py-4  text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-4  text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-4  text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
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
                    <p className="mt-2">Loading type partners...</p>
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
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && typePartners?.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={3}>
                  <p>No type partners found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              typePartners?.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="break-words px-4 py-2 text-center text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(item.id, item)}
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
