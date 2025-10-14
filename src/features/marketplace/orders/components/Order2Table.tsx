import { useEffect, useState } from "react";
import OrderTableHead from "./Order2TableHead";
import OrderTableRow from "./Order2TableRow";
import OrderTableSkeleton from "./Order2TableSkeleton";
import { OrderWithRelations } from "../types/order";

interface OrderTableProps {
  data: OrderWithRelations[];
  loading: boolean;
  onUpdate: (updatedOrder: OrderWithRelations) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (order: OrderWithRelations) => void;
  onDownload: (orderId: string) => Promise<void>;
  noOrdersMessage?: string;
}

const OrderTable = ({
  data,
  loading,
  onUpdate,
  onDelete,
  onEdit,
  onDownload,
  noOrdersMessage = "No orders found",
}: OrderTableProps) => {
  const [orders, setOrders] = useState<OrderWithRelations[]>(data);

  useEffect(() => {
    setOrders(data);
  }, [data]);

  if (data.length === 0 && !loading) {
    return <div className="text-center text-gray-500">{noOrdersMessage}</div>;
  }

  const handleUpdateOrder = async (updatedOrder: OrderWithRelations) => {
    try {
      await onUpdate(updatedOrder);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <OrderTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <OrderTableSkeleton />
          ) : (
            orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                onUpdate={handleUpdateOrder}
                onDelete={onDelete}
                onEdit={onEdit}
                onDownload={onDownload}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
