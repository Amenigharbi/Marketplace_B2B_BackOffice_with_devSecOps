export interface Partner {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
  mRoleId: string;
  isActive: boolean;
  logo?: any;
  patent?: any;
  responsibleName: string;
  position: string;
  coverageArea: string;
  minimumAmount: number;
  typePartnerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PartnerInput = Omit<
  Partner,
  "id" | "createdAt" | "updatedAt" | "isActive"
>;
