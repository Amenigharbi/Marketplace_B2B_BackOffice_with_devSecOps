const TaxTableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="h-4 w-24 rounded-full bg-gray-200"></div>
          </td>

          <td className="px-6 py-4">
            <div className="h-4 w-16 rounded-full bg-gray-200"></div>
          </td>

          <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TaxTableSkeleton;
