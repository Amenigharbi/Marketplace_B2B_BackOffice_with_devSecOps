import { useMilkRunStore } from "../../stores/milkRunStore";
import { useNavigation } from "../../../shared/hooks/useNavigation";
import { useGetMilkRunOrders } from "../../hooks/queries/useGetMilkRunOrders";
export const useMilkRunHistoryPage = () => {
  const { setDeliveryDate } = useMilkRunStore();

  const { navigateToOrderDetails } = useNavigation();

  const { orders, count: ordersCount, isLoading } = useGetMilkRunOrders();

  const onDetailsClick = (orderId: string): void => {
    navigateToOrderDetails();
  };

  return {
    orders,
    isLoading,
    ordersCount,
    onDetailsClick,
    onDeliveryDateChange: setDeliveryDate,
  };
};
