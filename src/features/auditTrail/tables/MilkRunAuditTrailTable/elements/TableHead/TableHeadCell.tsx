const TableHeadCell = ({ children, onClick }: any) => (
  <td className="h-16 w-6 border-x-2 border-n30  p-2 " onClick={onClick}>
    <div className="  flex  items-center justify-center   truncate text-ellipsis text-lg">
      {children}
    </div>
  </td>
);

export default TableHeadCell;
