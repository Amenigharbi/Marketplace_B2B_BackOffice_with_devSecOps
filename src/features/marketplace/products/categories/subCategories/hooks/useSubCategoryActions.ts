import { useState } from "react";
import { axios } from "@/libs/axios";
import { SubCategory } from "@/types/subCategory";
import { toast } from "react-hot-toast";

export function useSubCategoryActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editSubCategory = async (
    id: string,
    updatedSubCategory: Partial<SubCategory>,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", updatedSubCategory.name || "");
      formData.append("isActive", String(updatedSubCategory.isActive ?? true));
      formData.append("categoryId", updatedSubCategory.categoryId || "");

      if (updatedSubCategory.image) {
        formData.append("image", updatedSubCategory.image as File);
      }

      const response = await axios.servicesClient.patch(
        `/api/marketplace/sub_category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Subcategory updated successfully");
        return response.data.subCategory;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update subcategory";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating subcategory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubCategory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/sub_category/${id}`,
      );
      if (response.status === 200) {
        toast.success("Subcategory deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete subcategory";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting subcategory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editSubCategory, deleteSubCategory, isLoading, error };
}
