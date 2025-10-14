export type AuditLog = {
  username: string;
  userId: string;
  action: string;
  actionTime: Date;
  orderId: string;
  storeId: string;
};
