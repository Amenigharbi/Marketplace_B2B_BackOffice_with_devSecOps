import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getOrdersByDeliveryDateTypesense = async (
  deliveryDate: number,
): Promise<{ orders: any[]; count: number }> => {
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
    const date = new Date(Number(deliveryDate) * 1000);

    // Set the time to the last second of the day
    date.setUTCHours(23, 59, 59, 999);

    // Get the new timestamp for the last second of the day
    const lastSecondTimestamp = Math.floor(date.getTime() / 1000);

    const res = await typesense.orders.getMany({
      filterBy: `createdAt:=[${deliveryDate}..${lastSecondTimestamp}]`,
    });

    return res;
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
