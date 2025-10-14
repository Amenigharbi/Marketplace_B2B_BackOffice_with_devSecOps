import { useEffect, useState } from "react";
import TableCell from "./TableCell";

const TableRow = ({
  username,
  orderId,
  time,
  storeId,
  agentName,
  deliveryDate,
}: any) => {
  const [store, setStore] = useState("Tunis");

  useEffect(() => {
    switch (storeId) {
      case "1":
        setStore("Tunis");
        break;
      case "2":
        setStore("Sousse");
        break;
      case "3":
        setStore("Kmarket");
    }
  }, [storeId]);

  return (
    <tr className=" even:bg-primary/5 hover:bg-n30 dark:even:bg-bg3">
      {/* Username */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{username}</p>
      </TableCell>
      {/* Order Id */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{orderId}</p>
      </TableCell>
      {/* Store */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{store}</p>
      </TableCell>
      {/* Time */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{time}</p>
      </TableCell>
      {/* agentName */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{agentName}</p>
      </TableCell>
      {/* deliveryDate */}
      <TableCell>
        <p className=" truncate text-ellipsis text-sm">{deliveryDate}</p>
      </TableCell>
    </tr>
  );
};

export default TableRow;
