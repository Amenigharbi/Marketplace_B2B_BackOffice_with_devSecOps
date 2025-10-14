const PurchaseTableHead = () => {
  return (
    <thead
      className="border-b border-gray-100 bg-primary"
      style={{
        position: "sticky",
        top: 0,
        overflowX: "auto",
      }}
    >
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Order
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Supplier
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Warehouse
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Delivery
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Status
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Payments
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default PurchaseTableHead;
