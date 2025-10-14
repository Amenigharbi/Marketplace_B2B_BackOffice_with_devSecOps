import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateSubCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubCategory = async (
    subCategoryData: {
      name: string;
      isActive?: boolean;
      image?: File | null;
      categoryId: string;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", subCategoryData.name);
      formData.append("categoryId", subCategoryData.categoryId);
      formData.append("isActive", String(subCategoryData.isActive ?? true));

      if (subCategoryData.image) {
        formData.append("image", subCategoryData.image);
      }

      const response = await axios.post(
        "/api/marketplace/sub_category/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        toast.success("Subcategory created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error creating subcategory";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubCategory, isLoading, error };
}
