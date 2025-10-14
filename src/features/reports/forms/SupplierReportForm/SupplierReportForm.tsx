import { useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import RectangleSkeleton from "../../widgets/RectangleSkeleton";
import SupplierSelector from "../../widgets/SupplierSelector";
import DateRangePicker from "@/features/shared/inputs/DateRangePicker";
import ButtonSkeleton from "../../widgets/ButtonSkeleton/ButtonSkeleton";
import { useGetAllSuppliers } from "../../hooks/queries/useGetAllSuppliers";
import { useGenerateSupplierReport } from "../../hooks/mutations/useGenerateSupplierReport";
import { toast } from "react-hot-toast";

function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const SuppliersReportForm = () => {
  const [supplierId, setSupplierId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { isLoading, suppliers } = useGetAllSuppliers();

  const { generateSupplierReport, isPending } = useGenerateSupplierReport();

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      {isLoading}
      <div className="box w-full min-w-[800px]  xl:p-8">
        <div className="bb-dashed mb-6 flex items-center  pb-6">
          <p className="ml-4 text-xl font-bold">Download Supplier Report</p>
        </div>
        {!isLoading && (
          <div className="box mb-6   flex  justify-evenly bg-primary/5 dark:bg-bg3">
            <SupplierSelector
              suppliers={suppliers}
              onChange={(supplier: any) => {
                setSupplierId(supplier?.id);
              }}
            />
            <DateRangePicker
              onChange={(e: any) => {
                setToDate(e?.toDate);
                setFromDate(e?.fromDate);
              }}
            />
          </div>
        )}
        {isLoading && <RectangleSkeleton />}
        <div className="mt-6">
          <div className="mt-7 flex justify-end gap-4  lg:mt-10">
            {isLoading && <ButtonSkeleton />}

            {!isLoading && !isPending && (
              <button
                type="submit"
                className="btn px-4 hover:shadow-none"
                onClick={() => {
                  if (!toDate || !fromDate) {
                    toast.error(`Please Select Date Range`, { duration: 5000 });
                    return;
                  }
                  generateSupplierReport({
                    supplierId,
                    toDate: formatDate(toDate),
                    fromDate: formatDate(fromDate),
                  });
                }}
              >
                Download
              </button>
            )}
            {!isLoading && isPending && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersReportForm;
