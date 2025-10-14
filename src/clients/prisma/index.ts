export * from "./getUser";
export * from "./getPartner";
export * from "./prismaClient";

import { getUser } from "./getUser";
import { getPartner } from "./getPartner";
import { editUser } from "./editUser";
import { getAllUsers } from "./getAllUsers";
import { getAllOrdersLogs } from "./getAllOrdersLogs";
import { getAllMilkRunAuditLogs } from "./getAllMilkRunAuditLogs";
import { getAllLogs } from "./getAllLog";

export const prisma = {
  getUser,
  getPartner,
  editUser,
  getAllUsers,
  getAllOrdersLogs,
  getAllMilkRunAuditLogs,
  getAllLogs,
};
