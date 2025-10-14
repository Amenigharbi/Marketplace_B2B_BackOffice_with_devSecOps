export interface Source {
  id: string;
  name: string;
}
export interface ReservationItem {
  id: string;
  qteReserved: number;
  price: number;
  discountedPrice: number;
  weight: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  taxValue?: number;
  productId: string;
  productName: string;
  partnerId?: string;
  deliveryDate: Date;
  partner?: {
    id: string;
    username: string;
  };
  sourceId?: string;
  source?: {
    id: string;
    name: string;
  };
}
export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface OrderPayment {
  id: string;
  name: string;
}
export interface Reservation {
  id: string;
  amountTTC: number;
  amountOrdered: number;
  shippingMethod: string;
  isActive: boolean;
  loyaltyPtsValue: number;
  fromMobile: boolean;
  weight: number;
  customerId: string;
  customer: Customer;
  shippingAmount: number;
  paymentMethodId: string;
  paymentMethod: OrderPayment;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  reservationItems: ReservationItem[];
}
