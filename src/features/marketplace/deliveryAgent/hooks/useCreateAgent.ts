import { useState } from "react";
import axios from "axios";
import { Agent } from "@/types/agent";

export function useCreateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgent = async (
    agentData: Omit<Agent, "id">,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!agentData.firstName || !agentData.lastName || !agentData.username) {
        throw new Error("Required fields are missing");
      }

      const response = await axios.post("/api/marketplace/agents/create", {
        ...agentData,
        // Ensure optional fields are either provided or undefined
        roleId: agentData.roleId || undefined,
        telephone: agentData.telephone || undefined,
        address: agentData.address || undefined,
      });

      if (response.status === 201) {
        onSuccess?.();
      }
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error creating agent";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createAgent, isLoading, error };
}
