import Loading from "@/features/shared/elements/Loading";
import PreviousDeliveryDatePicker from "../widgets/PreviousDeliveryDatePicker";

const MilkRunHistoryFloatingSection = ({
  ordersCount,
  isLoading,
  onDeliveryDateChange,
}: any) => {
  return (
    <div className="absolute left-1 top-1 z-10 flex   flex-col items-center justify-between rounded-xl p-4 ">
      <div className="m-2 flex w-full flex-col items-center justify-center  rounded-xl bg-n20 p-2 shadow-xl ">
        <p className="mr-3 text-lg font-bold">Delivery Date </p>
        <PreviousDeliveryDatePicker
          direction="down"
          onChange={onDeliveryDateChange}
        />
      </div>
      <div className="m-1 flex  h-10 w-full items-center  rounded-xl bg-n20 pl-4 shadow-lg ">
        <p>
          Number of Orders :
          {!isLoading && <span className="font-bold">{ordersCount}</span>}
        </p>
        {isLoading && (
          <div className="ml-2 h-8 w-8 ">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkRunHistoryFloatingSection;
