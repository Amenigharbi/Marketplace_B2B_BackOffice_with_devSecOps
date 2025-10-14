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
