const PromoTableHead = () => {
  return (
    <thead className="border-b border-gray-100 bg-primary">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          ID
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Promo Price
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Start Date
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          End Date
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default PromoTableHead;
