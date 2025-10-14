import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const generateMultipleOrdersSummaries = async (
  ordersIdsString: string,
): Promise<string> => {
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
    const data = JSON.stringify({
      ordersIds: ordersIdsString,
    });

    const res = await axios.magentoClient.post(
      "order_summary/bulk_zip_generate",
      data,
    );
    return res?.data;
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
