import MilRunMap from "../../widgets/MilkRunMap/MilkRunMap";
import { useMilkRunHistoryPage } from "./useMilkRunHistoryPage";
import MilkRunHistoryFloatingSection from "../../widgets/MilkRunHistoryFloatingSection";

const MilkRunHistoryPage = () => {
  const {
    orders,
    ordersCount,
    onDetailsClick,
    onDeliveryDateChange,
    isLoading,
  } = useMilkRunHistoryPage();

  return (
    <div className="relative  mt-[4.8rem] flex  flex-grow overflow-hidden p-2">
      <MilRunMap ordersMarkers={orders} onDetailsClick={onDetailsClick} />

      <MilkRunHistoryFloatingSection
        isLoading={isLoading}
        ordersCount={ordersCount}
        onDeliveryDateChange={onDeliveryDateChange}
      />
    </div>
  );
};

export default MilkRunHistoryPage;
