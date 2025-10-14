import { prismaClient } from "./prismaClient";

export const getAllOrdersLogs = async (page: number = 0, take: number = 50) => {
  try {
    const ordersLogs = await prismaClient.ordersAuditTrail.findMany({
      take: take,
      skip: take * page,
      orderBy: {
        //@ts-ignore
        actionTime: "desc",
      },
    });
    const count = await prismaClient.ordersAuditTrail.count();
    return { ordersLogs, count };
  } catch (err) {
    console.error("Get Prisma All Orders Logs Error ", err);
    throw err;
  }
};
