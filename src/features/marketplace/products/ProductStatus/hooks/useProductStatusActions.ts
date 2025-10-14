import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface ProductStatus {
  id: string;
  name: string;
  actif: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useProductStatusActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit product status (activating/deactivating or renaming)
  const editProductStatus = async (
    id: string,
    updatedProductStatus: Partial<ProductStatus>,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `/api/marketplace/product_status/${id}`,
        updatedProductStatus,
      );
      if (response.status === 200) {
        toast.success("Product status updated successfully!");
        return response.data.productStatus;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update product status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating product status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product status
  const deleteProductStatus = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `/api/marketplace/product_status/${id}`,
      );
      if (response.status === 200) {
        toast.success("Product status deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete product status";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting product status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editProductStatus, deleteProductStatus, isLoading, error };
}
