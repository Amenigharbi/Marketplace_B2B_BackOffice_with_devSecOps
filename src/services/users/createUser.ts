import { hashPassword } from "@/utils/password";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const createUser = async (newUser: any): Promise<any> => {
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
    const existingUser = await prismaClient.user.findUnique({
      where: { username: newUser.username },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(newUser.password);

    const user = await prismaClient.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new Error("Unable To Create User");
    }
    return user;
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
