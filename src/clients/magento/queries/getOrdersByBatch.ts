import { axios } from "@/libs/axios";

import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

const batchSize = 250;

export const getOrdersByBatch = async (page: any) => {
  const session = await auth();
  if (!session?.user) {
    return "Unauthorized";
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
    const response = await axios.magentoClient.get(
      `/orders?searchCriteria[pageSize]=${batchSize}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC`,
    );
    return {
      items: response.data.items,
    };
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
    throw new Error();
  }
};
