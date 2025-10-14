import { useEffect, useState } from "react";
import { useOrdersAuditTrailTableStore } from "../../stores/ordersAuditTrailTableStore";

export const usePagination = (totalItems: number) => {
  const [endIndex, setEndIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const { currentPage, itemsPerPage } = useOrdersAuditTrailTableStore();

  useEffect(() => {
    setEndIndex(Math.min(startIndex + itemsPerPage - 1, totalItems - 1));
  }, [startIndex, itemsPerPage, totalItems, setEndIndex]);

  useEffect(() => {
    setStartIndex((currentPage - 1) * itemsPerPage);
  }, [currentPage, itemsPerPage, setStartIndex]);

  return {
    endIndex,
    totalItems,
    startIndex,
  };
};
