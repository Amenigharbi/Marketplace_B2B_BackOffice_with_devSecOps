import { useState } from "react";

type Order = "ASC" | "DSC";

type SortDataFunction<T> = (col: keyof T | string) => void;
type DeleteItemFunction<T> = (id: number | string) => void;
type PaginateFunction = (page: number) => void;
type SearchFunction<T> = (term: string) => void;

interface SortableTableHook<T> {
  tableData: T[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  sortData: SortDataFunction<T>;
  deleteItem: DeleteItemFunction<T>;
  paginate: PaginateFunction;
  nextPage: () => void;
  prevPage: () => void;
  search: SearchFunction<T>;
  startIndex: number;
  endIndex: number;
  totalData: number;
}

const useTable = <T extends Record<string, any>>(
  initialData: T[],
  initialItemsPerPage: number = 10,
): SortableTableHook<T> => {
  const [tableData, setTableData] = useState<T[]>(initialData);
  const [order, setOrder] = useState<Order>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(initialItemsPerPage);

  const sortData: SortDataFunction<T> = (col) => {
    const colString = String(col);

    const [parentCol, childCol] = colString.split(".");

    if (order === "ASC") {
      const sorted = [...tableData].sort((a, b) => {
        const aValue = childCol ? a[parentCol][childCol] : a[colString];
        const bValue = childCol ? b[parentCol][childCol] : b[colString];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.toLowerCase() > bValue.toLowerCase() ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });

      setTableData(sorted);
      setOrder("DSC");
    } else {
      const sorted = [...tableData].sort((a, b) => {
        const aValue = childCol ? a[parentCol][childCol] : a[colString];
        const bValue = childCol ? b[parentCol][childCol] : b[colString];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.toLowerCase() < bValue.toLowerCase() ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setTableData(sorted);
      setOrder("ASC");
    }
  };

  const deleteItem: DeleteItemFunction<T> = (id) => {
    const updatedData = tableData.filter((item) => item.id !== id);
    setTableData(updatedData);
  };

  const paginate: PaginateFunction = (page) => {
    setCurrentPage(page);
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const search: SearchFunction<T> = (term) => {
    const filteredData = initialData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase()),
      ),
    );
    setTableData(filteredData);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage - 1,
    tableData.length - 1,
  );
  const totalData = tableData.length;
  return {
    tableData: currentItems,
    currentPage,
    itemsPerPage,
    totalPages,
    sortData,
    deleteItem,
    paginate,
    search,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    totalData,
  };
};

export default useTable;
