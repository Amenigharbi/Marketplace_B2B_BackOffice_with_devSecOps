import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

type Params = {
  toDate: string;
  fromDate: string;
  supplierId: string;
};

export const generateSupplierReport = async ({
  toDate,
  fromDate,
  supplierId,
}: Params): Promise<string> => {
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
    if (supplierId) {
      const res = await axios.magentoClient.get(
        `orders/saleslist_without_sum?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}&manufacturer=${supplierId}`,
      );
      return res?.data;
    } else {
      const res = await axios.magentoClient.get(
        `orders/saleslist_without_sum?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}`,
      );
      return res?.data;
    }
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
