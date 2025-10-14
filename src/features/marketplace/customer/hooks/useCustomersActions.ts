import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Customer } from "@/types/customer";
import { toast } from "react-hot-toast";

export function useCustomersActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editCustomer = async (id: string, formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate required fields from FormData
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");

      if (!firstName || !lastName) {
        const errorMsg = "Missing required fields";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const response = await axios.patch(
        `/api/marketplace/customers/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        const successMsg = "Customer updated successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return true;
      } else {
        return false;
      }
    } catch (err: AxiosError | any) {
      console.error("Error editing customer:", err);
      const errorMsg = err.response?.data?.error || "Failed to edit customer";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.delete(`/api/marketplace/customers/${id}`);
      if (response.status === 200) {
        const successMsg = "Customer deleted successfully!";
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        return response.data.message;
      }
    } catch (err: AxiosError | any) {
      console.error("Error deleting customer:", err);
      const errorMsg = err.response?.data?.error || "Failed to delete customer";
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { editCustomer, deleteCustomer, isLoading, error, successMessage };
}
