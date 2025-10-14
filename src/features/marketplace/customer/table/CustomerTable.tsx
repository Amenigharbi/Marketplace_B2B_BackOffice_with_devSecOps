import { FaEdit, FaTrash } from "react-icons/fa";
import { useCustomersActions } from "../hooks/useCustomersActions";
import { Customer } from "@/types/customer";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useState } from "react";
interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isSidebarOpen?: boolean;
  onEdit: (id: string, customer: Customer) => void;
  onDelete?: (id: string) => Promise<void>;
}

export default function CustomerTable({
  customers,
  isLoading,
  error,
  refetch,
  onEdit,
}: CustomerTableProps) {
  const { editCustomer, deleteCustomer } = useCustomersActions();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (
    id: string,
    firstName: string,
    lastName: string,
  ) => {
    setCustomerToDelete({
      id,
      name: `${firstName} ${lastName}`,
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id).then(() => {
        refetch();
        setDeleteModalOpen(false);
      });
    }
  };

  return (
    <>
      <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-hidden">
          <div className="overflow-y-auto">
            <div className="h-[calc(100vh-250px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="sticky top-0 z-10 border-b border-gray-100 bg-primary shadow-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                      Governorate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-red-500">{error}</p>
                          <button
                            onClick={refetch}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : customers?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    customers?.map((customer) => (
                      <tr
                        key={customer.id}
                        className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.firstName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.lastName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.telephone}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <div className="max-w-xs truncate">
                            {customer.address}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {customer.governorate}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => onEdit(customer.id, customer)}
                              className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  customer.id,
                                  customer.firstName,
                                  customer.lastName,
                                )
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-600"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        customerName={customerToDelete?.name}
      />
    </>
  );
}
