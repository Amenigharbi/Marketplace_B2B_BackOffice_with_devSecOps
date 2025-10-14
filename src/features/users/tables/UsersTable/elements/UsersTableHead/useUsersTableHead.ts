import { useState } from "react";

export const useOrdersTableHead = (
  changeSelectedSort: (selected: any) => void,
) => {
  const [sort, setSort] = useState("");

  const onTotalClick = () => {
    setSort(sort === "total:asc" ? "total:desc" : "total:asc");
    changeSelectedSort(
      sort === "total:asc"
        ? { name: "Highest Total", key: "total:desc" }
        : { name: "Lowest Total", key: "total:asc" },
    );
  };

  const onDeliveryDateClick = () => {
    setSort(
      sort === "deliveryDate:asc" ? "deliveryDate:desc" : "deliveryDate:asc",
    );
    changeSelectedSort(
      sort === "deliveryDate:asc"
        ? { name: "Latest Delivery Date", key: "deliveryDate:desc" }
        : { name: "Earliest Delivery Date", key: "deliveryDate:asc" },
    );
  };

  const onCustomerClick = () => {
    setSort(
      sort === "customerFirstname:asc"
        ? "customerFirstname:desc"
        : "customerFirstname:asc",
    );
    changeSelectedSort(
      sort === "customerFirstname:asc"
        ? { name: "Customers (Z-A)", key: "customerFirstname:desc" }
        : { name: "Customers (A-Z)", key: "customerFirstname:asc" },
    );
  };

  return { onTotalClick, onDeliveryDateClick, onCustomerClick };
};
