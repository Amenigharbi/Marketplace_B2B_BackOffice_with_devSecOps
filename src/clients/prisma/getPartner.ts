import { prismaClient } from "./prismaClient";

export const getPartner = async (username: string) => {
  try {
    const partner = await prismaClient.partner.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });

    return partner;
  } catch (err) {
    console.error("Get Prisma Partner Error ", err);
  }
};
