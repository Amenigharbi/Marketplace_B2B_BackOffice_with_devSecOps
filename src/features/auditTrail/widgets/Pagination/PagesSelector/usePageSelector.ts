import { useState } from "react";
import { usePageSelectorEffects } from "./usePageSelectorEffects";

export const usePageSelector = () => {
  const [totalPages, setTotalPages] = useState(0);

  const [showedNumbers, setShowedNumbers] = useState<any[]>([]);

  const [pagesList, setPagesList] = useState<any[]>([]);

  //const { currentPage, itemsPerPage, setCurrentPage } = useOrdersTableStore();

  const paginate = (page: number) => {
    //setCurrentPage(page);
  };

  const nextPage = () => {
    /*if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }*/
  };

  const prevPage = () => {
    /* if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }*/
  };

  usePageSelectorEffects({
    status,
    pagesList,
    totalPages,
    //totalItems,
    //currentPage,
    setPagesList,
    //itemsPerPage,
    setTotalPages,
    showedNumbers,
    //setCurrentPage,
    setShowedNumbers,
  });

  return {
    totalPages,
    //currentPage,
    nextPage,
    prevPage,
    paginate,
    pagesList,
  };
};
