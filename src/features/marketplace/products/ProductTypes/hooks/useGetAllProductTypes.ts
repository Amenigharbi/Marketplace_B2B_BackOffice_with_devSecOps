import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { ProductType } from "@/types/productType";

export const useGetAllProductTypes = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductTypes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        productTypes: ProductType[];
      }>("/api/marketplace/product_type/getAll");
      setProductTypes(data.productTypes || []);
    } catch (err) {
      let errorMessage = "Failed to fetch product types";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setProductTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return {
    productTypes,
    isLoading,
    error,
    refetch: fetchProductTypes,
    isEmpty: !isLoading && !error && productTypes.length === 0,
  };
};
