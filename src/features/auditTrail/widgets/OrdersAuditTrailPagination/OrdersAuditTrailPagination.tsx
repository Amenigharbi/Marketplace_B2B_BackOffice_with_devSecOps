import PageSelector from "../../widgets/PagesSelector";
import { useOrdersAuditTrailPagination } from "./useOrdersAuditTrailPagination";

const OrdersAuditTrailPagination = ({ count }: any) => {
  const { startIndex, endIndex } = useOrdersAuditTrailPagination(count);

  return (
    <div
      className=" col-span-12 flex h-14  w-full flex-wrap items-center
     justify-center gap-4  rounded-xl bg-n10 px-2 sm:justify-between"
    >
      <p>
        {!!count &&
          `Showing ${startIndex + 1} to ${endIndex + 1} of ${count} items`}
        {!count && "Showing  ***  to  ***  of  *** items"}
      </p>

      <PageSelector />
    </div>
  );
};

export default OrdersAuditTrailPagination;
