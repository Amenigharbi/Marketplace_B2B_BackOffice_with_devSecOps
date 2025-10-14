import { Order } from "@/types/order";
import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { GetManyOrdersParams } from "./getManyOrders.types";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getManyOrders = async ({
  sortBy,
  page,
  perPage,
  search,
  filterBy,
}: GetManyOrdersParams): Promise<
  { orders: Order[]; totalOrders: number } | undefined
> => {
  const session = await auth();
  if (!session?.user) {
    return { orders: [], totalOrders: 0 };
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
    const res = await typesense.orders.getMany({
      sortBy,
      page,
      perPage,
      search,
      filterBy,
    });

    return res;
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
  }
};
