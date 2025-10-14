import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { Agent } from "@/types/agent";

export const useGetAllAgents = () => {
  const [agent, setAgent] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ agents: Agent[] }>(
        "/api/marketplace/agents/getAll",
      );

      setAgent(data.agents || []);
    } catch (err) {
      let errorMessage = "Failed to fetch agents";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setAgent([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, []);
  return {
    agent,
    isLoading,
    error,
    refetch: fetchAgent,
    isEmpty: !isLoading && !error && agent.length === 0,
  };
};
