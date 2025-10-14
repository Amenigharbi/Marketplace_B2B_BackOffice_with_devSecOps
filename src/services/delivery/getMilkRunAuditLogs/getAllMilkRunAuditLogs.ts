import { prisma } from "@/clients/prisma";
import { logError } from "@/utils/logError";

export const getAllMilkRunAuditLogs = async (page: number) => {
  try {
    const take = 50;
    const ordersLogs = await prisma.getAllMilkRunAuditLogs(page, take);
    return ordersLogs;
  } catch (error: any) {
    logError(error);
    throw new Error(
      error.message || "An error occurred while fetching milk run audit logs.",
    );
  }
};
