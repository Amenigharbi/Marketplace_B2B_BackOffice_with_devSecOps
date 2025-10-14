export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  telephone: string;
  address: string;
  password: string;
  retailer_profile?: any;
  roleId?: string;
  created_at?: string;
  isActive: boolean;
}
