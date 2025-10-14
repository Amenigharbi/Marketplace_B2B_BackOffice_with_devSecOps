import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface State {
  id: string;
  name: string;
}

export function useStateActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editState = async (id: string, updatedState: State) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Updating state...", {
      position: "top-center",
      autoClose: false,
    });

    try {
      const response = await axios.patch(
        `/api/marketplace/state/${id}`,
        updatedState,
      );

      if (response.status === 200) {
        toast.update(toastId, {
          render: "State updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        return response.data.state;
      }
    } catch (err: any) {
      let errorMessage = "Failed to update state";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteState = async (id: string) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Deleting state...", {
      position: "top-center",
      autoClose: false,
    });

    try {
      const response = await axios.delete(`/api/marketplace/state/${id}`);

      if (response.status === 200) {
        toast.update(toastId, {
          render: "State deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        return response.data.message;
      }
    } catch (err: any) {
      let errorMessage = "Failed to delete state";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { editState, deleteState, isLoading, error };
}
