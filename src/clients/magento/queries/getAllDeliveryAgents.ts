import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getDeliveryAgents = async () => {
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
      "/customers/search/?searchCriteria[filterGroups][0][filters][0][field]=group_id&searchCriteria[filterGroups][0][filters][0][value]=4",
    );
    return response?.data?.items;
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
