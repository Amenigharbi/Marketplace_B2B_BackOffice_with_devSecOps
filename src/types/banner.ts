export interface Banner {
  updated_at: Date | string;
  created_at: Date | string;
  id: string;
  url: string;
  altText?: string;
  description?: string;
}
