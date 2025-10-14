import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface UseAxiosProps<T> {
  loading: boolean;
  error: AxiosError<T> | null;
  response: AxiosResponse<T> | null;
  fetchData: (
    endpoint: string,
    method?: HttpMethod,
    data?: any,
    config?: AxiosRequestConfig,
    apiKey?: string,
  ) => Promise<AxiosResponse<T> | void>;
}

const BASE_URL =
  process.env.BASE_URL_EXPRESS_PUBLIC || "http://102.219.178.14:3000";

const useAxios = <T>(): UseAxiosProps<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError<T> | null>(null);
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null);

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  const fetchData = useCallback(
    async (
      endpoint: string,
      method: HttpMethod = "get",
      data?: any,
      config?: AxiosRequestConfig,
      apiKey?: string,
    ): Promise<AxiosResponse<T> | void> => {
      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        const axiosConfig: AxiosRequestConfig = {
          method,
          url: endpoint,
          data,
          ...config,
        };

        if (apiKey) {
          axiosConfig.headers = {
            ...axiosConfig.headers,
            "X-API-Key": apiKey,
          };
        }

        const result = await axiosInstance(axiosConfig);
        setResponse(result);
        return result;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err);
        } else {
          setError(new Error("An unexpected error occurred") as AxiosError<T>);
        }
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance],
  );

  return { loading, error, response, fetchData };
};

export default useAxios;
