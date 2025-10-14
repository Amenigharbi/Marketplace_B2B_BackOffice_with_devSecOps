import { useState } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

export function useProductActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editProduct = async (id: string, updatedProduct: Partial<Product>) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { id: _, ...updateData } = updatedProduct;

      // Convert loyalty points values to numbers
      const numericData = {
        ...updateData,
        loyaltyPointsPerProduct: updateData.loyaltyPointsPerProduct
          ? Number(updateData.loyaltyPointsPerProduct)
          : undefined,
        loyaltyPointsPerUnit: updateData.loyaltyPointsPerUnit
          ? Number(updateData.loyaltyPointsPerUnit)
          : undefined,
        loyaltyPointsBonusQuantity: updateData.loyaltyPointsBonusQuantity
          ? Number(updateData.loyaltyPointsBonusQuantity)
          : undefined,
        loyaltyPointsThresholdQty: updateData.loyaltyPointsThresholdQty
          ? Number(updateData.loyaltyPointsThresholdQty)
          : undefined,
      };

      const response = await axios.patch(
        `/api/marketplace/products/${id}`,
        numericData,
      );

      if (response.status === 200) {
        const successMsg = "Product updated successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error updating product";
      setError(errorMsg);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.delete(`/api/marketplace/products/${id}`);
      if (response.status === 200) {
        const successMsg = "Product deleted successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return response.data.message;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating product");
      console.error("Error deleting product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editProduct, deleteProduct, isLoading, error };
}
