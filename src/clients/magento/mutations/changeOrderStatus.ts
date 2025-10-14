import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";
import { NextResponse } from "next/server";

export const changeOrderStatus = async ({
  orderId,
  status,
  state,
}: any): Promise<any> => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    let response;
    if (status === "unpaid") {
      const data = {
        orders: orderId,
      };

      response = await axios.magentoClient.post("orders/manage/complete", data);
      //
    } else {
      const data = {
        orders: [
          {
            orderId: orderId, // each order will have an orderId
            status: status,
            state: state,
          },
        ],
      };

      response = await axios.magentoClient.put("orders/status_change", data);
      //
    }
    return response.data;

    // Return the response data
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
    throw new Error("Failed to change order status");
  }
};
