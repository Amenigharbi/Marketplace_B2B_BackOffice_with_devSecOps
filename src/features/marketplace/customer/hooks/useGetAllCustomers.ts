import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Customer } from "@/types/customer";

export const useGetAllCustomers = () => {
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{
        customers: Customer[];
      }>("/api/marketplace/customers/getAll");

      setCustomer(data.customers || []);
    } catch (err) {
      let errorMessage = "Failed to fetch customers";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setCustomer([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomers,
    isEmpty: !isLoading && !error && customer.length === 0,
  };
};
