import { useState, useEffect } from "react";
import { axios } from "@/libs/axios"; // Adjust based on your project structure
import { ProductStatus } from "@/types/productStatus"; // Assuming the type for ProductStatus is defined

export const useGetAllProductStatuses = () => {
  const [productStatuses, setProductStatuses] = useState<ProductStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductStatuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        productStatuses: ProductStatus[];
      }>("/api/marketplace/product_status/getAll");

      setProductStatuses(data.productStatuses || []);
    } catch (err) {
      let errorMessage = "Failed to fetch product statuses";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setProductStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductStatuses();
  }, []);

  return {
    productStatuses,
    isLoading,
    error,
    refetch: fetchProductStatuses,
    isEmpty: !isLoading && !error && productStatuses.length === 0,
  };
};
