import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Agent } from "@/types/agent";

export function useAgentsActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editAgent = async (id: string, updatedAgent: Partial<Agent>) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!updatedAgent.firstName || !updatedAgent.lastName) {
        throw new Error("Missing required fields");
      }

      const formData = new FormData();
      formData.append("firstName", updatedAgent.firstName);
      formData.append("lastName", updatedAgent.lastName);
      if (updatedAgent.telephone)
        formData.append("telephone", updatedAgent.telephone);
      if (updatedAgent.username)
        formData.append("username", updatedAgent.username);
      if (updatedAgent.address)
        formData.append("address", updatedAgent.address);

      if (updatedAgent.password?.trim()) {
        formData.append("password", updatedAgent.password.trim());
      }

      const response = await axios.patch(
        `/api/marketplace/agents/${id}`,
        formData,
      );

      if (response.status === 200) {
        setSuccessMessage("Agent updated successfully!");
        return response.data.agent;
      }
    } catch (err: AxiosError | any) {
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.delete(`/api/marketplace/agents/${id}`);
      if (response.status === 200) {
        setSuccessMessage("Agent deleted successfully!");
        return response.data.message;
      }
    } catch (err: AxiosError | any) {
      console.error("Error deleting agent:", err);
      setError(err.response?.data?.error || "Failed to delete agent");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { editAgent, deleteAgent, isLoading, error, successMessage };
}
