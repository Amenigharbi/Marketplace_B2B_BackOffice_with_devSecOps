import CustomerTable from "../table/CustomerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import { useState, useEffect, useMemo } from "react";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useGetAllCustomers } from "../hooks/useGetAllCustomers";
import { Customer } from "@/types/customer";
import { useCustomersActions } from "../hooks/useCustomersActions";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import CreateCustomerModal from "../components/CreateCustomerModel";
import EditCustomerModal from "../components/EditCustomerModel";
import { FiPlus, FiSearch } from "react-icons/fi";

const CustomerPage = () => {
  const {
    customer: customers,
    isLoading,
    error,
    refetch,
  } = useGetAllCustomers();
  const {
    editCustomer,
    deleteCustomer,
    isLoading: isActionLoading,
    error: actionError,
  } = useCustomersActions();
  const {
    createCustomer,
    isLoading: isCreating,
    error: createError,
  } = useCreateCustomer();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((customer) => {
      const searchContent =
        `${customer.id} ${customer.firstName} ${customer.lastName} ${customer.email} ${customer.telephone} ${customer.address}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    // Add sorting
    result = result.sort((a, b) => {
      if (sortState === "newest") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      } else {
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        );
      }
    });

    return result;
  }, [customers, searchTerm, sortState]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  const handleEdit = async (id: string, formData: FormData) => {
    try {
      const result = await editCustomer(id, formData);
      if (result) {
        await refetch();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error editing customer:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCustomer(id);
      if (result) {
        refetch();
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const handleCreate = async (customerData: Omit<Customer, "id">) => {
    try {
      const result = await createCustomer(customerData);
      if (result) {
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full flex-col p-4 pt-8">
      {/* Header Section */}
      <div className="flex-shrink-0 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold capitalize text-primary md:text-3xl">
            Customers
          </h1>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-n30 p-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="whitespace-nowrap font-bold">
                Sort by:
              </label>
              <select
                id="sort"
                className="rounded-lg border border-n30 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortState}
                onChange={(e) =>
                  setSortState(e.target.value as "newest" | "oldest")
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* New Customer Button - Garder le style original */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn flex h-10 items-center justify-center gap-2 whitespace-nowrap px-4"
              title="New Customer"
              disabled={isCreating}
            >
              <FiPlus className="h-5 w-5" />
              <span className="hidden md:inline">New Customer</span>
              <span className="inline md:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Table Container */}
      <div className="relative flex w-full flex-grow flex-col overflow-y-auto bg-n10 px-3">
        <CustomerTable
          customers={paginatedCustomers}
          isLoading={isLoading || isActionLoading}
          error={error || actionError}
          refetch={refetch}
          onEdit={(id: string) => {
            const customer = customers.find((c) => c.id === id);
            if (customer) openEditModal(customer);
          }}
          onDelete={handleDelete}
        />
      </div>

      <Divider />

      {/* Pagination and Modals */}
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <CreateCustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
          isLoading={isCreating}
          error={createError}
        />

        {isEditModalOpen && selectedCustomer && (
          <EditCustomerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEdit}
            customer={selectedCustomer}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
