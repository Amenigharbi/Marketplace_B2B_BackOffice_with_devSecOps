import { useEffect, useState } from "react";

import { getAllOrdersLogs } from "@/clients/prisma/getAllOrdersLogs";
import { useOrdersAuditTrailTableStore } from "@/features/auditTrail/stores/ordersAuditTrailTableStore";
import { useGetOrdersAuditTrail } from "@/features/auditTrail/hooks/useGetOrdersAuditTrail";

export const useOrdersAuditTrailPagination = (count: number) => {
  const itemsPerPage = 50;
  const [endIndex, setEndIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const { currentPage } = useOrdersAuditTrailTableStore();

  useEffect(() => {
    setEndIndex(Math.min(startIndex + itemsPerPage + 1, count - 1));
  }, [startIndex, itemsPerPage, count, setEndIndex]);

  useEffect(() => {
    setStartIndex((currentPage - 1) * itemsPerPage);
  }, [currentPage, itemsPerPage, setStartIndex]);

  return {
    endIndex,
    startIndex,
  };
};
