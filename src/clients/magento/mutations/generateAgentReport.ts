import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";
import { NextResponse } from "next/server";

type Params = {
  toDate: string;
  fromDate: string;
  agentId: string;
};

export const generateAgentReport = async ({
  toDate,
  fromDate,
  agentId,
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
    if (agentId) {
      const res = await axios.magentoClient.get(
        `/agents/agent_report?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}&agentId=${agentId}`,
      );

      return res?.data;
    } else {
      const res = await axios.magentoClient.get(
        `/agents/agent_report?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}`,
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
