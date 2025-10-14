const ReservationTableHead = () => {
  return (
    <thead className="sticky top-0 z-50 border-b border-gray-100 bg-primary shadow-sm">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          ID
        </th>
        <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount TTC
        </th>
        <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Ordered
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
          Shipping Method
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Shipping Amount
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          State
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          From Mobile
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Weight
        </th>
        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Customer
        </th>

        <th className="px-8 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Payment Method
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Created At
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Updated At
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
          Reservation Items
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Comment
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ReservationTableHead;
