import { useEffect } from "react";
import { isArraysEqual } from "@/utils/isArraysEqual";

export const usePageSelectorEffects = ({
  pagesList,
  totalPages,
  totalItems,
  currentPage,
  setPagesList,
  itemsPerPage = 50,
  setTotalPages,
  showedNumbers,
  setShowedNumbers,
}: any) => {
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
      const start = Math.max(0, currentPage - 5); // Ensure non-negative start
      const res = showedNumbers.slice(start, currentPage);

      setShowedNumbers(res);
    }
  }, [totalPages, itemsPerPage, setShowedNumbers, currentPage]);
};
