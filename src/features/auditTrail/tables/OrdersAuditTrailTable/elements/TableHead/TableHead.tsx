import TableHeadCell from "./TableHeadCell";

const TableHead = () => {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="  h-12  w-full bg-n40 font-semibold">
        <TableHeadCell>Username</TableHeadCell>
        <TableHeadCell>Action</TableHeadCell>
        <TableHeadCell>Order ID</TableHeadCell>
        <TableHeadCell>Store</TableHeadCell>
        <TableHeadCell>Time </TableHeadCell>
      </tr>
    </thead>
  );
};

export default TableHead;
