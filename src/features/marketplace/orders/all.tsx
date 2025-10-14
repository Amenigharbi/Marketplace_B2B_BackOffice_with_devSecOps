import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import OrderTable from "./components/Order2Table";
import Pagination from "../../shared/elements/Pagination/Pagination";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import EditOrderForm from "./components/EditOrderForm";
import AdvancedFilter from "./components/AdvancedFilter";
import { downloadOrderPDF } from "./utils/pdfUtils";
import { OrderWithRelations } from "./types/order";
import {
  Agent,
  OrderPayment,
  Partner,
  State,
  Status,
  Customers,
} from "@prisma/client";
import EditOrderItemsForm from "./Modal/EditOrderItems";

const OrderManagementPage = () => {
  const { setNotifications } = useGlobalStore();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderWithRelations | null>(
    null,
  );
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const initialFilters = {
    statusId: "",
    stateId: "",
    customerId: "",
    agentId: "",
    paymentMethodId: "",
    fromMobile: "",
    isActive: "",
    minAmountExclTax: "",
    maxAmountExclTax: "",
    minAmountTTC: "",
    maxAmountTTC: "",
    minAmountRefunded: "",
    maxAmountRefunded: "",
    minAmountCanceled: "",
    maxAmountCanceled: "",
    minAmountOrdered: "",
    maxAmountOrdered: "",
    minAmountShipped: "",
    maxAmountShipped: "",
    minLoyaltyPtsValue: "",
    maxLoyaltyPtsValue: "",
    minAmount: "",
    maxAmount: "",
    minWeight: "",
    maxWeight: "",
    dateFrom: "",
    dateTo: "",
    shippingMethod: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<OrderPayment[]>([]);
  const [customers, setCustomers] = useState<Customers[]>([]);
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const [editingOrderItems, setEditingOrderItems] =
    useState<OrderWithRelations | null>(null);
  const closeAllModals = () => {
    setEditingOrder(null);
    setEditingOrderItems(null);
    setIsModalOpen(false);
  };
  const loadFilterData = async () => {
    try {
      const endpoints = [
        {
          url: "/api/marketplace/status/getAll",
          setter: setStatuses,
          dataKey: "statuses",
        },
        {
          url: "/api/marketplace/state/getAll",
          setter: setStates,
          dataKey: "states",
        },
        {
          url: "/api/marketplace/agents/getAll",
          setter: setAgents,
          dataKey: "agents",
        },
        {
          url: "/api/marketplace/payment_method/getAll",
          setter: setPaymentMethods,
          dataKey: "paymentMethods",
        },
        {
          url: "/api/marketplace/customers/getAll",
          setter: setCustomers,
          dataKey: "customers",
        },
      ];

      const results = await Promise.allSettled(
        endpoints.map(async ({ url }) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ${url}`);
          return res.json();
        }),
      );

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const { dataKey, setter } = endpoints[index];
          const dataArray = result.value[dataKey] || [];
          setter(dataArray);
        }
      });
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL(
        "/api/marketplace/orders/getAll",
        window.location.origin,
      );
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("limit", itemsPerPage.toString());

      if (debouncedSearchTerm) {
        url.searchParams.append("searchById", debouncedSearchTerm);
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalOrders(data.totalOrders || 0);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedOrder: OrderWithRelations) => {
    try {
      const response = await fetch(
        `/api/marketplace/orders/${updatedOrder.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedOrder),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update order");
      }

      const result = await response.json();

      // Ajouter la notification au store global
      if (result.notification) {
        setNotifications(result.notification);
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
      fetchOrders();
      toast.success("Order updated successfully!");
      closeAllModals();
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteOrderId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    try {
      const response = await fetch(`/api/marketplace/orders/${deleteOrderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order.id !== deleteOrderId));
      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeleteOrderId(null);
    }
  };

  const handleDownload = async (orderId: string) => {
    const orderToDownload = orders.find((order) => order.id === orderId);
    if (!orderToDownload) return;

    try {
      downloadOrderPDF(orderToDownload);
    } catch (error) {
      toast.error(`Error downloading order: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearchTerm, itemsPerPage, filters]);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
      <div className="flex h-screen w-full flex-col p-4">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="relative grid h-full w-full items-center justify-center gap-4">
            <div className="box w-full min-w-[800px] xl:p-14">
              <div className="bb-dashed mb-4 flex items-center justify-between pb-4">
                <p className="ml-4 text-3xl font-bold text-primary">
                  Order Management
                </p>
              </div>

              <div className="mb-5 space-y-4">
                <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                  <input
                    type="text"
                    placeholder="Search by Order ID..."
                    className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    🔍
                  </span>
                  <button
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Advanced Filter
                  </button>
                </div>
              </div>

              {showAdvancedFilter && (
                <AdvancedFilter
                  statuses={statuses}
                  states={states}
                  agents={agents}
                  customers={customers}
                  paymentMethods={paymentMethods}
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => {
                    setFilters(initialFilters);
                    setShowAdvancedFilter(false);
                  }}
                  onApply={() => {
                    setShowAdvancedFilter(false);
                    setCurrentPage(1);
                  }}
                />
              )}

              <div className="box mb-5 mt-5 flex max-h-[600px] w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3">
                <OrderTable
                  data={orders}
                  loading={loading}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onEdit={setEditingOrder}
                  onDownload={handleDownload}
                />
              </div>

              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </div>
          </div>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />

        {editingOrder && (
          <EditOrderForm
            order={editingOrder}
            onClose={closeAllModals}
            onUpdate={handleUpdate}
          />
        )}
        {editingOrderItems && (
          <EditOrderItemsForm
            orderItems={editingOrderItems.orderItems || []}
            onClose={closeAllModals}
            onUpdate={({
              updatedItems,
              amountRefunded,
              amountOrdered,
              amountShipped,
              amountCanceled,
            }) => {
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order.id === editingOrderItems.id
                    ? {
                        ...order,
                        orderItems: updatedItems,
                        amountRefunded,
                        amountOrdered,
                        amountShipped,
                        amountCanceled,
                      }
                    : order,
                ),
              );
              toast.success("Order items updated successfully!");
              closeAllModals();
            }}
            isOpen={!!editingOrderItems}
          />
        )}
        <ConfirmDeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default OrderManagementPage;
