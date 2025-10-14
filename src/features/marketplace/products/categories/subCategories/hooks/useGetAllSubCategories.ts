import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { SubCategory } from "@/types/subCategory";

export const useGetAllSubCategories = (categoryId: string) => {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const refetch = async () => {
  //   try {
  //     const response = await axios.get(`/api/subcategories?categoryId=${categoryId}`);
  //     setSubcategories(response.data);
  //   } catch (err) {
  //     setError("Failed to fetch subcategories");
  //   }
  // };

  // useEffect(() => {
  //   if (categoryId) {
  //     refetch();
  //   }
  // }, [categoryId]);

  // return { subcategories, isLoading, error, refetch };
};
