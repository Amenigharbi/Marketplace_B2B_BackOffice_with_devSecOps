import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface ProductType {
  id: string;
  name: string; // Assuming "name" is a key for product types; adjust if necessary
  type: string; // Adjust as necessary
  createdAt?: string;
  updatedAt?: string;
}

export function useProductTypeActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProductType = async (
    id: string,
    updatedProductType: Partial<ProductType>,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/product_type/${id}`,
        updatedProductType,
      );
      if (response.status === 200) {
        toast.success("Product type updated successfully!");
        return response.data.productType;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update product type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating product type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProductType = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/api/marketplace/product_type/${id}`,
      );
      if (response.status === 200) {
        toast.success("Product type deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete product type";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting product type:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editProductType, deleteProductType, isLoading, error };
}
