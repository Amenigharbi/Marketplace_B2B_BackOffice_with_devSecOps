import PageSelector from "./PagesSelector";
import { usePagination } from "./usePagination";

const Pagination = ({ numberOfItems }: any) => {
  const { totalItems, startIndex, endIndex } = usePagination(numberOfItems);

  return (
    <div
      className=" col-span-12 flex h-14  w-full flex-wrap items-center
     justify-center gap-4  rounded-xl bg-n10 px-2 sm:justify-between"
    >
      <p>
        {!!totalItems &&
          `Showing ${startIndex + 1} to ${endIndex + 1} of ${totalItems} items`}
        {!totalItems && "Showing  ***  to  ***  of  *** items"}
      </p>

      <PageSelector />
    </div>
  );
};

export default Pagination;
