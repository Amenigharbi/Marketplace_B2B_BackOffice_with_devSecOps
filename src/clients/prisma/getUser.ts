import { prismaClient } from "./prismaClient";

export const getUser = async (username: string) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  } catch (err) {
    console.error("Get Prisma User Error ", err);
  }
};
