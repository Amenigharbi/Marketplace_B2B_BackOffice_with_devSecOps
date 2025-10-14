const TaxTableHead = () => {
  return (
    <thead className="sticky top-0 z-10 border-b border-gray-100 bg-primary">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          ID
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Value
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TaxTableHead;
