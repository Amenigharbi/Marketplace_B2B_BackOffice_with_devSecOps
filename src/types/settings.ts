export interface Setting {
  id: string;
  deliveryType: string;
  deliveryTypeAmount: string;
  freeDeliveryAmount: string;
  loyaltyPointsAmount: string;
  loyaltyPointsUnique: string;
  partnerId?: string;
  createdAt?: string;
  updatedAt?: string;
  schedules: { day: string; startTime: string; endTime: string }[];
  partner?: any;
}
