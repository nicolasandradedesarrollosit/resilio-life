"use client"

import { useState, useEffect } from "react";

interface UseApiProps {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
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

export const useApi = <T = any>(props: UseApiProps): UseApiReturn<T> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001/api';
    const { 
        endpoint, 
        method = 'GET', 
        body, 
        headers = {}, 
        includeCredentials = true,
        enabled = true 
    } = props;

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        if (!enabled) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
                credentials: includeCredentials ? 'include' : 'omit',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMsg);
            console.error("Error fetching data:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint, method, JSON.stringify(body), JSON.stringify(headers), includeCredentials, enabled]);

    return { data, error, loading, refetch: fetchData };
};