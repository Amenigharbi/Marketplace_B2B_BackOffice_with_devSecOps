const OrdersTableHeadCell = ({ children, onClick }: any) => (
  <td className="border-b border-gray-100 bg-primary" onClick={onClick}>
    <div className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
      {children}
    </div>
  </td>
);

export default OrdersTableHeadCell;
