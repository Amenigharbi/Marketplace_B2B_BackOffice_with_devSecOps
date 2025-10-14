import { useEffect } from "react";

export const useResetPageSelector = ({
  status,
  itemsPerPage,
  setCurrentPage,
}: any) => {
  useEffect(() => {
    setCurrentPage(1);
  }, [status, setCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, setCurrentPage]);
};
