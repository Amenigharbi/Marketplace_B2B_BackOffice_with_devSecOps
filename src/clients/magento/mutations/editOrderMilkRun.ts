import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";
import { NextResponse } from "next/server";

export const editOrderMilkRun = async ({
  orderId,
  deliverySlot,
  deliveryAgentName,
  deliveryAgentId,
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
    const data = {
      entity: {
        entity_id: orderId,

        extension_attributes: {
          delivery_slot: deliverySlot,
          delivery_agent: deliveryAgentName,
          delivery_agent_id: deliveryAgentId,
        },
      },
    };
    await axios.magentoClient.put("orders/delivery_info", data);
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
