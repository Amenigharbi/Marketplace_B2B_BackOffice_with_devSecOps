import { useState } from "react";
import { usePageSelectorEffects } from "./usePageSelectorEffects";
import { useResetPageSelector } from "./useResetPageSelector";
import { useGetOrdersAuditTrail } from "../../hooks/useGetOrdersAuditTrail";
import { useOrdersAuditTrailTableStore } from "../../stores/ordersAuditTrailTableStore";

export const usePageSelector = () => {
  const [totalPages, setTotalPages] = useState(0);

  const { currentPage, setCurrentPage } = useOrdersAuditTrailTableStore();
  const { count: totalItems } = useGetOrdersAuditTrail(currentPage);

  const [showedNumbers, setShowedNumbers] = useState<any[]>([]);

  const [pagesList, setPagesList] = useState<any[]>([]);

  const paginate = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useResetPageSelector({ setCurrentPage });
  usePageSelectorEffects({
    pagesList,
    totalPages,
    totalItems,
    currentPage,
    setPagesList,
    setTotalPages,
    showedNumbers,
    setCurrentPage,
    setShowedNumbers,
  });

  return {
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    paginate,
    pagesList,
  };
};
