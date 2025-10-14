import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useStatusActions } from "../hooks/useStatusActions";
import EditStatusModal from "../components/EditStatusModal";

interface Status {
  id: string;
  name: string;
  stateId: string;
}

interface State {
  id: string;
  name: string;
}

interface StatusTableProps {
  status: Status[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isSidebarOpen: boolean;
  onEdit: (id: string, updatedStatus: Status) => void;
  states: State[];
}

export default function StatusTable({
  status,
  isLoading,
  error,
  refetch,
  isSidebarOpen,
  states,
}: StatusTableProps) {
  const { editStatus } = useStatusActions();
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (id: string, updatedStatus: Status) => {
    editStatus(id, updatedStatus).then(() => {
      refetch();
    });
  };

  return (
    <div>
      <div className="box mb-5 w-full rounded-lg p-0">
        <table className="min-w-full">
          <thead className="border-b border-gray-100 bg-primary">
            <tr>
              <th className="sticky top-0 bg-primary px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
                ID
              </th>
              <th className="sticky top-0 bg-primary px-6 py-4 text-center  text-xs font-semibold uppercase tracking-wider text-white">
                Name
              </th>
              <th className="sticky top-0 bg-primary px-6 py-4 text-center  text-xs font-semibold uppercase tracking-wider text-white">
                State Name
              </th>
              <th className="sticky top-0 bg-primary px-6 py-4 text-center  text-xs font-semibold uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-600" colSpan={4}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading ...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td className="px-4 py-4 text-center text-red-600" colSpan={4}>
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

            {!isLoading && !error && status?.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                  <p>No statuses match your search criteria.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              status?.map((item) => (
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
                  <td className="break-words px-4 py-2 text-center text-sm text-gray-900">
                    {states.find((s) => s.id === item.stateId)?.name ||
                      item.stateId}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedStatus(item);
                        setIsEditModalOpen(true);
                      }}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isEditModalOpen && selectedStatus && (
        <EditStatusModal
          isOpen={isEditModalOpen}
          status={selectedStatus}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedStatus) => {
            handleEdit(selectedStatus.id, updatedStatus);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
