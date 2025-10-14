import cn from "@/utils/cn";
import { usePageSelector } from "./usePageSelector";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const PageSelector = () => {
  const { totalPages, nextPage, prevPage, paginate, pagesList } =
    usePageSelector();

  return (
    <ul className="flex flex-wrap items-center gap-2 md:gap-3 md:font-semibold">
      <li>
        <button
          onClick={prevPage}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
          )}
        >
          <IconChevronLeft />
        </button>
      </li>
      {!!pagesList.length &&
        pagesList?.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => paginate(page)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 md:h-10 md:w-10",
              )}
            >
              {page}
            </button>
          </li>
        ))}

      <li>
        <button
          onClick={nextPage}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-primary text-primary duration-300 hover:bg-primary hover:text-n0 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary md:h-10 md:w-10 rtl:rotate-180",
          )}
        >
          <IconChevronRight />
        </button>
      </li>
    </ul>
  );
};

export default PageSelector;
