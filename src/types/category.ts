export interface Category {
  id: string;
  nameCategory: string;
  isActive?: boolean;
  image?: any;
  createdAt?: Date;
  updatedAt?: Date;
  subCategories: SubCategory[];
  supplierCategories?: any[];
}

export interface SubCategory {
  id: string;
  name: string;
  isActive?: boolean;
  image?: any | null;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  productSubCategories?: any[];
}
