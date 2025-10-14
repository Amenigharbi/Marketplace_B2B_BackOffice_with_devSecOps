import { useEffect, useState } from "react";
import PurchaseTableHead from "../components/PurchaseTable/PurchaseTableHead";
import PurchaseTableRow from "../components/PurchaseTable/PurchaseTableRow";
import PurchaseTableSkeleton from "../components/PurchaseTable/PurchaseTableSkeleton";
import { PurchaseOrder } from "../components/types/purchaseOrder";

const PurchaseTable = ({
  data,
  loading,
}: {
  data: PurchaseOrder[];
  loading: boolean;
}) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(data);

  useEffect(() => {
    const filteredOrders = data.filter((order) => order.status === "READY");

    setOrders(filteredOrders);
  }, [data]);

  const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  return (
    <div className="overflow-x-auto">
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
