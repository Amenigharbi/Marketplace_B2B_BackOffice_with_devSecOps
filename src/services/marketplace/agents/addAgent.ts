import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const createAgent = async (newAgent: any): Promise<any> => {
  const session = await auth();
  if (!session?.user) {
    return { agents: [], count: 0 };
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
    const existingAgent = await prismaClient.agent.findUnique({
      where: { username: newAgent.username },
    });

    if (existingAgent) {
      throw new Error("Agent already exists");
    }

    const hashedPassword = await hashPassword(newAgent.password);

    const agent = await prismaClient.agent.create({
      data: {
        ...newAgent,
        password: hashedPassword,
      },
    });

    if (!agent) {
      throw new Error("Unable to create agent");
    }

    return agent;
  } catch (err) {
    await createLog({
      type: "error",
      message: (err as Error).message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });

    logError(err);
  }
};
