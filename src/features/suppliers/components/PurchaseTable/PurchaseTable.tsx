import { useEffect, useState } from "react";
import PurchaseTableHead from "./PurchaseTableHead";
import PurchaseTableRow from "./PurchaseTableRow";
import PurchaseTableSkeleton from "./PurchaseTableSkeleton";
import { PurchaseOrder } from "../types/purchaseOrder";

const PurchaseTable = ({
  data,
  loading,
}: {
  data: PurchaseOrder[];
  loading: boolean;
}) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(data);

  useEffect(() => {
    setOrders(data);
  }, [data]);

  const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  return (
    <div>
      <table className="w-full">
        <PurchaseTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <PurchaseTableSkeleton />
          ) : (
            orders.map((order) => (
              <PurchaseTableRow
                key={order.id}
                order={order}
                onUpdate={handleUpdateOrder}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;
