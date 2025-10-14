import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Product } from "@/types/product";

export const useGetAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ products: Product[] }>(
        "/api/marketplace/products/getAll",
      );
      setProducts(data.products || []);
    } catch (err) {
      let errorMessage = "Failed to fetch products";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    isEmpty: !isLoading && !error && products.length === 0,
  };
};
