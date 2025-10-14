import { useState } from "react";
import Loading from "@/features/shared/elements/Loading";
import RectangleSkeleton from "../../widgets/RectangleSkeleton";
import DateRangePicker from "@/features/shared/inputs/DateRangePicker";
import ButtonSkeleton from "../../widgets/ButtonSkeleton/ButtonSkeleton";
import DeliveryAgentSelector from "@/features/shared/inputs/DeliveryAgentSelector";
import { useGenerateAgentReport } from "../../hooks/mutations/useGenerateAgentReport";
import { useGetDeliveryAgents } from "@/features/shared/hooks/queries/useGetDeliveryAgents";

import { toast } from "react-hot-toast";

function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const AgentReportForm = () => {
  const [toDate, setToDate] = useState("");
  const [agentId, setAgentId] = useState("");
  const [fromDate, setFromDate] = useState("");

  const { deliveryAgents, isLoading } = useGetDeliveryAgents();
  const { generateAgentReport, isPending } = useGenerateAgentReport();

  return (
    <div className="grid h-full w-full items-center justify-center gap-4  xxxl:gap-6 ">
      {isLoading}
      <div className="box w-full min-w-[800px]  xl:p-8">
        <div className="bb-dashed mb-6 flex items-center  pb-6">
          <p className="ml-4 text-xl font-bold">Download Agent Report</p>
        </div>
        {!isLoading && (
          <div className=" box flex w-full justify-between   bg-primary/5   dark:bg-bg3">
            <DeliveryAgentSelector
              deliveryAgents={deliveryAgents}
              onChange={(agent: any) => {
                setAgentId(agent.id);
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
                  // if (!agentId) {
                  //   toast.error(`Please Select an Agent`, {
                  //     duration: 5000,
                  //   });
                  //   return;
                  // }
                  if (!toDate || !fromDate) {
                    toast.error(`Please Select Date Range`, {
                      duration: 5000,
                    });
                    return;
                  }
                  generateAgentReport({
                    agentId,
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

export default AgentReportForm;
