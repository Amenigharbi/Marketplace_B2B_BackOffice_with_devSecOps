import { useEffect } from "react";
import { isArraysEqual } from "@/utils/isArraysEqual";

export const usePageSelectorEffects = ({
  status,
  pagesList,
  totalPages,
  totalItems,
  currentPage,
  setPagesList,
  itemsPerPage,
  setTotalPages,
  showedNumbers,
  setCurrentPage,
  setShowedNumbers,
}: any) => {
  useEffect(() => {
    setCurrentPage(1);
  }, [status, setCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, setCurrentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage, setTotalPages]);

  useEffect(() => {
    if (showedNumbers.length && !isArraysEqual(showedNumbers, pagesList)) {
      setPagesList(showedNumbers);
    }
  }, [showedNumbers, pagesList, setPagesList]);

  useEffect(() => {
    let showedNumbers: number[] = Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
    if (currentPage <= 5) {
      const res: number[] = showedNumbers.slice(0, Math.min(5, totalPages));

      setShowedNumbers(res);
    } else {
      const res = showedNumbers.slice(currentPage - 5, currentPage);

      setShowedNumbers(res);
    }
  }, [totalPages, itemsPerPage, setShowedNumbers, currentPage]);
};
