import {
  Order as PrismaOrder,
  Status,
  State,
  Customers,
  Agent,
  Partner,
  OrderItem,
  LoyaltyPoints,
  OrderPayment,
  Product,
  Tax,
  Source,
} from "@prisma/client";

export type OrderItemWithRelations = OrderItem & {
  id: string;
  qteOrdered: number;
  qteRefunded: number;
  qteShipped: number;
  qteCanceled: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  orderId: string;
  deliveryDate?: string | Date;
  product?: Product;
  tax?: Tax;
  productName?: string;
  sourceName?: string;
  partnerName?: string;
  source?: Source;
  partner?: Partner;
  customer?: Customers;
};

export type OrderWithRelations = PrismaOrder & {
  amountTTC: number;
  amountRefunded: number;
  amountCanceled: number;
  amountOrdered: number;
  amountShipped: number;
  shippingMethod: string;
  loyaltyPtsValue: number;
  isActive: boolean;
  fromMobile: boolean;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate?: string | Date;
  status?: Status | null;
  comment: string | null;
  state?: State | null;
  customer?: Customers | null;
  agent?: Agent | null;
  orderItems: OrderItemWithRelations[];
  loyaltyPoints: LoyaltyPoints[];
  paymentMethod: OrderPayment | null;
  paymentMethodId: string | null;
};
