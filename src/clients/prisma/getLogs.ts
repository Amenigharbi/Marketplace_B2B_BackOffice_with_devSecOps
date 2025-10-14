import { PrismaClient } from "@prisma/client";
import { Log } from "@/types/log";

const prisma = new PrismaClient();

export async function createLog(log: Log) {
  const { type, message, context, timestamp, dataBefore, dataAfter } = log;
  //@ts-ignore
  await prisma.log.create({
    data: {
      type,
      message,
      context,
      timestamp: new Date(),
      dataBefore,
      dataAfter,
    },
  });
}
