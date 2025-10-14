import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { getMergedItems } from "./getMergedItems";
import { getOrderProducts } from "../getOrderProducts";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getOrder = async (id: string): Promise<any> => {
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
    const typesenseOrder: any = await typesense.orders.getOne(id);
    const typesenseOrderItems = typesenseOrder?.items;

    const magentoOrderProducts = await getOrderProducts(id);

    const mergedItems =
      magentoOrderProducts.length > 0
        ? getMergedItems({
            typesenseOrderItems,
            magentoOrderProducts,
          })
        : typesenseOrderItems;

    const order = { ...typesenseOrder, items: mergedItems };
    return order;
  } catch (error) {
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
    throw new Error(`Failed to get order with ID: ${id}`);
  }
};
