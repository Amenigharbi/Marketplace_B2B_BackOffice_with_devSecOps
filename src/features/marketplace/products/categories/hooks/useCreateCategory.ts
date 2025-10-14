import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (
    categoryData: {
      nameCategory: string;
      isActive?: boolean;
      image?: File | null;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("nameCategory", categoryData.nameCategory);

      if (categoryData.isActive !== undefined) {
        formData.append("isActive", String(categoryData.isActive));
      }

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      const response = await axios.post(
        "/api/marketplace/category/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        toast.success("Category created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create category";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createCategory, isLoading, error };
}
