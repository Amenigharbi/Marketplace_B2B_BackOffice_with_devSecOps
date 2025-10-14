import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Category } from "@/types/category";

export const useGetAllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        categories: Category[];
      }>("/api/marketplace/category/getAll");

      setCategories(data.categories || []);
    } catch (err) {
      let errorMessage = "Failed to fetch categories";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    isEmpty: !isLoading && !error && categories.length === 0,
  };
};
