import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getAllOrdersLogs = async (page: number) => {
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
    const take = 50;
    const { ordersLogs, count } = await prisma.getAllOrdersLogs(page, take);
    return { ordersLogs, count };
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
    throw new Error(
      error.message || "An error occurred while fetching order logs.",
    );
  }
};
