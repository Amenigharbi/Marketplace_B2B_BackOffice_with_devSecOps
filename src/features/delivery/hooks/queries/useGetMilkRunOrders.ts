import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useMilkRunStore } from "../../stores/milkRunStore";
import { useEffect, useState } from "react";

interface Order {
  longitude: number;
  // Add other properties of the Order if needed
}

function adjustDuplicateLongitudes(orders: Order[]): Order[] {
  if (orders) {
    // Filter out orders with longitude 0 and invalid longitude values
    orders = orders.filter(
      (order) =>
        typeof order.longitude === "number" &&
        !isNaN(order.longitude) &&
        order.longitude !== 0,
    );

    // Group orders by longitude
    const ordersByLongitude: { [key: number]: Order[] } = orders.reduce(
      (acc, order) => {
        const { longitude } = order;
        //@ts-ignore
        if (!acc[longitude]) acc[longitude] = [];
        //@ts-ignore
        acc[longitude].push(order);
        return acc;
      },
      {},
    );

    // Function to generate a random number between 0.0001 and 0.0009
    const getRandomAdjustment = (): number =>
      parseFloat((Math.random() * 0.008 + 0.001).toFixed(4));

    // Adjust the longitude for duplicate orders
    Object.values(ordersByLongitude).forEach((orderGroup) => {
      if (orderGroup.length > 1) {
        // Skip the first order in the group (keep its original longitude)
        for (let i = 1; i < orderGroup.length; i++) {
          let randomAdjustment: number;
          do {
            randomAdjustment = getRandomAdjustment();
          } while (isNaN(randomAdjustment));

          // Ensure the adjusted longitude is a valid number
          if (!isNaN(orderGroup[i].longitude)) {
            orderGroup[i].longitude += randomAdjustment;
          }
        }
      }
    });

    // Flatten the orders back into a single array
    orders = Object.values(ordersByLongitude).flat();
  }
  return orders;
}

export const useGetMilkRunOrders = () => {
  const { deliveryDate } = useMilkRunStore();

  const { storeId } = useGlobalStore();

  const [list, setList] = useState([]);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["milkRunOrders", deliveryDate],
    queryFn: async () => {
      if (storeId && deliveryDate) {
        const { data } = await axios.servicesClient(
          `/api/delivery/getManyOrdersByDeliveryDate?deliveryDate=${deliveryDate}&storeId=${storeId}`,
        );

        return data || [];
      } else {
        const { data } = await axios.servicesClient(
          `/api/delivery/getManyOrdersByDeliveryDate?deliveryDate=${deliveryDate}`,
        );

        return data || [];
      }
    },

    refetchInterval: 180000,
  });

  useEffect(() => {
    const list = adjustDuplicateLongitudes(data?.orders);
    //@ts-ignore
    setList(list);
  }, [data]);

  return {
    orders: list,
    count: data?.count || 0,
    isLoading,
    refetch,
  };
};
