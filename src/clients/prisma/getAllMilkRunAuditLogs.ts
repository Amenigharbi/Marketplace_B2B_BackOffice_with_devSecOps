import { prismaClient } from "./prismaClient";

export const getAllMilkRunAuditLogs = async (
  page: number = 0,
  take: number = 50,
) => {
  try {
    //@ts-ignore
    const milkRunLogs = await prismaClient.milkRunAuditTrail.findMany({
      take: take,
      skip: take * page,
      orderBy: {
        //@ts-ignore
        actionTime: "desc",
      },
    });

    return milkRunLogs;
  } catch (err) {
    console.error("Get Prisma All Milk Run Logs Error ", err);
    throw err;
  }
};
