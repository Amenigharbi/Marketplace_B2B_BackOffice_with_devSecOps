const ManufacturerTableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="h-4 w-12 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-28 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-36 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          <td className="px-6 py-4">
            <div className="flex space-x-2">
              <div className="h-5 w-5 rounded bg-gray-200"></div>
              <div className="h-5 w-5 rounded bg-gray-200"></div>
              <div className="h-5 w-5 rounded bg-gray-200"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ManufacturerTableSkeleton;
