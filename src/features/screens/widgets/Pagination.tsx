import React from "react";
import cn from "@/utils/cn";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
        )}
      >
        <IconChevronLeft />
      </button>

      <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
        )}
      >
        <IconChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
