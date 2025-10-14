export type PurchaseOrderStatus =
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "COMPLETED";

export interface Product {
  id: string;

  name: string;

  quantity: number;

  priceExclTax: number;

  sku: string;

  total: number;

  manufacturer?: string;
}
export interface Payment {
  paymentMethod: string;
  amount: number;
  paymentDate?: Date;
}

export interface Supplier {
  manufacturer_id: number;
  companyName: string;
}

export interface Warehouse {
  warehouse_id: number;
  name: string;
}

export interface PurchaseOrder {
  products: Product[];
  id: string;
  orderNumber: string;
  manufacturer: Supplier | null;
  manufacturerId: number;
  warehouse: Warehouse | null;
  warehouseId: number;
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  payments: Payment[];
  paymentTypes: {
    type: string;
    percentage: number;
    amount: number;
    paymentDate: Date;
  }[];
  comment: string;
  files: { name: string; url: string }[];
}

export type PurchaseOrderUpdate = Partial<{
  deliveryDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
  warehouseId: number;
  supplierId: number;
  products: Product[];
  paymentTypes: {
    type: string;
    percentage: number;
    amount: number;
    paymentDate: Date;
  }[];
  comment: string;
  files: { name: string; url: string }[];
}>;
