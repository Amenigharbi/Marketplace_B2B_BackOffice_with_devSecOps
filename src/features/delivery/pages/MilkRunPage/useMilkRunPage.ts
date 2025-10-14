import { toast } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useMilkRunStore } from "../../stores/milkRunStore";
import { useNavigation } from "../../../shared/hooks/useNavigation";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { useGetMilkRunOrders } from "../../hooks/queries/useGetMilkRunOrders";
import { useEditOrdersMilkRun } from "../../hooks/mutations/useEditOrdersMilkRun";
import { useGetDeliveryAgents } from "../../../shared/hooks/queries/useGetDeliveryAgents";

//To Refactor
export const useMilkRunPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deliveryAgentSelectorRef = useRef(null);

  const deliverySlotSelectorRef = useRef(null);

  const {
    reset,
    deliverySlot,
    deliveryDate,
    deliveryAgentId,
    setDeliveryDate,
    setDeliverySlot,
    selectedOrdersIds,
    deliveryAgentName,
    setDeliveryAgentId,
    setSelectedOrdersIds,
    setDeliveryAgentName,
  } = useMilkRunStore();

  const { storeId } = useGlobalStore();

  const { navigateToOrderDetails } = useNavigation();

  const { deliveryAgents, isLoading: isDeliveryAgentsLoading } =
    useGetDeliveryAgents();

  const {
    orders,
    count: ordersCount,
    isLoading: isOrdersLoading,
    refetch,
  } = useGetMilkRunOrders();

  const { editOrdersMilkRun, isPending } = useEditOrdersMilkRun();

  const onOrderMarkerClick = (orderId: string): void => {
    let list = selectedOrdersIds;

    const index = list.indexOf(orderId);

    index !== -1 ? list.splice(index, 1) : list.push(orderId);

    setSelectedOrdersIds(list);
  };

  const onDetailsClick = (orderId: string): void => {
    navigateToOrderDetails();
  };

  const onDeliveryAgentChange = ({ name, id }: any) => {
    setDeliveryAgentName(name);
    setDeliveryAgentId(id);
  };

  const onReset = () => {
    toast.success("Reset");
    reset();
    //@ts-ignore
    deliveryAgentSelectorRef?.current?.reset();
    //@ts-ignore
    deliverySlotSelectorRef?.current?.reset();
  };

  const onValidate = (): void => {
    if (!selectedOrdersIds?.length) {
      toast.error("Please Select some Orders", { duration: 3000 });
      return;
    }

    if (!deliveryAgentId) {
      toast.error("Please Select Delivery Agent", { duration: 3000 });
      return;
    }

    if (!deliverySlot) {
      toast.error("Please Select Delivery Slot", { duration: 3000 });
      return;
    }

    editOrdersMilkRun({
      ordersIds: selectedOrdersIds,
      deliverySlot,
      deliveryAgentName,
      deliveryAgentId,
    });

    onReset();
  };

  useEffect(() => {
    if (isDeliveryAgentsLoading || isOrdersLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isDeliveryAgentsLoading, isOrdersLoading, setIsLoading]);

  useEffect(() => {
    refetch();
  }, [storeId, deliveryDate, refetch]);

  return {
    orders,
    onReset,
    isPending,
    isLoading,
    onValidate,
    ordersCount,
    onDetailsClick,
    deliveryAgents,
    selectedOrdersIds,
    onOrderMarkerClick,
    onDeliveryAgentChange,
    deliverySlotSelectorRef,
    deliveryAgentSelectorRef,
    onMilkRunChange: setDeliverySlot,
    onDeliveryDateChange: setDeliveryDate,
  };
};
