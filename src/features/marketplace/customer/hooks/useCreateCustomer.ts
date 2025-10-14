import { useState } from "react";
import axios from "axios";
import { Customer } from "@/types/customer";
import { toast } from "react-hot-toast";

export function useCreateCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (customerData: Omit<Customer, "id">) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      Object.entries(customerData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await axios.post(
        "/api/marketplace/customers/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        toast.success("Customer created successfully!");
        return response.data.customer;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to create customer";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createCustomer, isLoading, error };
}
