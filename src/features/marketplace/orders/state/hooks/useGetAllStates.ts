import { useState, useEffect } from "react";
import { axios } from "@/libs/axios";
import { State } from "@/types/state";

export const useGetAllStates = () => {
  const [state, setState] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.servicesClient.get<{ states: State[] }>(
        "/api/marketplace/state/getAll",
      );
      setState(data.states || []);
    } catch (err) {
      let errorMessage = "Failed to fetch states";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "An unknown error occurred";
      }

      setError(errorMessage);
      setState([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);
  return {
    state,
    isLoading,
    error,
    refetch: fetchStates,
    isEmpty: !isLoading && !error && state.length === 0,
  };
};
