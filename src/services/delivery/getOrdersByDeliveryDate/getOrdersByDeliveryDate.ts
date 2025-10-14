import { magento } from "@/clients/magento";
import { typesense } from "@/clients/typesense";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getOrdersByDeliveryDate = async ({
  deliveryDate,
  storeId,
}: any): Promise<{ orders: any[]; count: number }> => {
  const session = await auth();
  if (!session?.user) {
    return { orders: [], count: 0 };
  }

  const User = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  try {
    const orders: any = await magento.queries.getMilkRunOrdersByDate(
      deliveryDate,
    );

    if (!storeId) {
      return { orders: orders || [], count: orders?.length || 0 };
    }
    const filteredOrders = [];

    for (const order of orders) {
      //@ts-ignore
      const orderDetails = await typesense.orders.getOne(order?.order_id);

      //@ts-ignore
      if (orderDetails?.storeId === storeId) {
        filteredOrders.push(order);
      }
    }

    if (typeof orders === "string") {
      throw new Error(orders);
    }

    return { orders: filteredOrders, count: filteredOrders?.length || 0 };
  } catch (error: any) {
    await createLog({
      type: "error",
      message: (error as Error).message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
    logError(error);
    throw error;
  }
};
