import { PrismaClient } from "@prisma/client";
import { MilkRunAuditLog } from "@/types/MilkRunAuditLog";

const prisma = new PrismaClient();

export async function createMilkRunAuditLog(auditObject: MilkRunAuditLog) {
  const {
    username,
    userId,
    action,
    actionTime,
    orderId,
    storeId,
    agentId,
    agentName,
    deliveryDate,
  } = auditObject;
  //@ts-ignore
  /*
  await prisma.milkRunAuditTrail.create({
    data: {
      username,
      userId,
      action,
      actionTime: new Date(),
      orderId,
      storeId,
      agentId,
      agentName,
      deliveryDate,
    },
  });*/
}
