import { prismaClient } from "./prismaClient";

export const getAllLogs = async () => {
  try {
    const logs = await prismaClient.log.findMany();

    if (!logs || logs.length === 0) {
      throw new Error("No logs found");
    }

    return logs;
  } catch (err) {
    return [];
  }
};
