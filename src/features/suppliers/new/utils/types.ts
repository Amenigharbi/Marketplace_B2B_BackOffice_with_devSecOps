import {
  Product as PrismaProduct,
  Warehouse as PrismaWarehouse,
} from "@prisma/client";

export type Warehouse = PrismaWarehouse & {
  products: Product[];
};

export type Supplier = {
  id: string;
  manufacturer_id: number;
  manufacturerId?: number;
  companyName: string;
  contact_name: string;
  email: string;
  phone_number: string;
  postal_code: string | null;
  city: string;
  country: string;
  capital: string;
};
export type Product = Partial<PrismaProduct> & {
  website_ids: number[];
  skuPartner: string | null;
};

export interface ProductWithQuantities {
  product: Product;
  quantity: number;
  sku: string;
  id: string;
  priceExclTax: number;
  total: number;
}
export type SimplifiedProduct = {
  id: string;

  product_id: number;

  sku: string;

  name: string;

  price: number;

  cost: number | null;

  website_ids: number[];

  manufacturer: string | null;

  supplierId: string | null;
};

export type PaymentType = {
  type: string;
  percentage: string;
  amount: string;
  date: Date;
};
