"use client";

import { useState, useEffect } from "react";

interface UseApiProps {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object | null;
  headers?: Record<string, string>;
  includeCredentials?: boolean;
  enabled?: boolean;
}

interface UseApiReturn<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useApi = <T = any,>(props: UseApiProps): UseApiReturn<T> => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
  const {
    endpoint,
    method = "GET",
    body,
    headers = {},
    includeCredentials = true,
    enabled = true,
  } = props;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (force: boolean = false) => {
    if (!enabled && !force) return;

    setLoading(true);
    setError(null);

    try {
      let url = `${API_BASE_URL}/api${endpoint}`;

      if (method === "GET" && body && !(body instanceof FormData)) {
        const bodyObj = body as Record<string, unknown>;
        const keys = Object.keys(bodyObj);

        if (keys.length === 1) {
          url += `/${String(bodyObj[keys[0]])}`;
        }
      }

      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method,
        headers: isFormData
          ? headers
          : {
              "Content-Type": "application/json",
              ...headers,
            },
        body:
          method !== "GET" && body
            ? isFormData
              ? body
              : JSON.stringify(body)
            : undefined,
        credentials: includeCredentials ? "include" : "omit",
      });

      if (!response.ok) {
        let errorMsg = `Error ${response.status}`;

        try {
          const errorData = await response.json();

          errorMsg = errorData?.message || errorData?.error || errorMsg;
        } catch {}

        throw new Error(errorMsg);
      }

      const result =
        response.status === 204 ? ({} as T) : await response.json();

      setData(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, method, JSON.stringify(body), includeCredentials, enabled]);

  return { data, error, loading, refetch: () => fetchData(true) };
};
