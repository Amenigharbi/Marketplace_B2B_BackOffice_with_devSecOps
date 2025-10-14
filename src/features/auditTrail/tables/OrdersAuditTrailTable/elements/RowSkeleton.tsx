const TableRowsSkeleton = ({ number = 5 }: { number?: number }) => {
  return (
    <tr>
      {[...Array(number)].map((_, i) => (
        <td key={i} className="animate-pulse  p-1">
          <div className="h-12 w-full  rounded-xl bg-n40 dark:bg-n400" />
        </td>
      ))}
    </tr>
  );
};

export default TableRowsSkeleton;
