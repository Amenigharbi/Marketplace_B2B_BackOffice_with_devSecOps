export interface Product {
  id: string;
  barcode: string;
  name: string;
  sku: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
  pcb?: string;
  weight?: number;
  minimumQte?: number;
  maximumQte?: number;
  sealable?: number;
  alertQte?: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
  typePcbId?: string;
  productTypeId?: string;
  productStatusId?: string;
  supplierId?: string;
  taxId?: string;
  promotionId?: string;
  promo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  supplier?: {
    id: string;
    companyName: string;
  };
  productStatus?: {
    id: string;
    name: string;
    actif: boolean;
  };
  productSubCategories?: any[];
  relatedProducts?: any[];
  images?: any[];
}
