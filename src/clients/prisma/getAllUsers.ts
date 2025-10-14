import { prismaClient } from "./prismaClient";

export const getAllUsers = async () => {
  try {
    const users = await prismaClient.user.findMany({
      where: {
        roleId: { not: "1" },
      },
    });
    if (!users) {
      throw new Error();
    }
    return users;
  } catch (err) {
    console.error("Get Prisma All Users Error ", err);
  }
};
