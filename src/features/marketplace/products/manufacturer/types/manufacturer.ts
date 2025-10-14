export interface Category {
  id: string;
  categoryId?: number;
  nameCategory: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupplierCategory {
  id: string;
  supplierId: string;
  categoryId: string;
  category?: Category;
}

export interface Manufacturer {
  id: string;
  manufacturerId: number;
  code: string;
  companyName: string;
  contactName?: string;
  phoneNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  capital?: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  supplierCategories?: SupplierCategory[];
  selectedProductIds?: string[];
  productsCount?: number;
  assignedProducts?: Array<{
    id: string;
    name: string;
    sku: string;
  }>;
}
