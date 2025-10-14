const TableCell = ({ children }: any) => (
  <td className="   border-2  ">
    <div className="flex  select-none items-center justify-center   truncate text-ellipsis p-4 text-sm">
      {children}
    </div>
  </td>
);

export default TableCell;
