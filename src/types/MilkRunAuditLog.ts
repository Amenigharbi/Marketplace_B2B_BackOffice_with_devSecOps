export type MilkRunAuditLog = {
  username: string;
  userId: string;
  action: string;
  actionTime: Date;
  orderId: string;
  storeId: string;
  agentId: string;
  agentName: string;
  deliveryDate: string;
};
