import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useApi } from "@/shared/hooks";
import {
  selectTransactionsData,
  setTransactionsData,
  clearTransactionsData,
  setLoading,
} from "@/features/transactions/transactionsSlice";
import type { TransactionData } from "@/shared/types";

export function useTransactions() {
  const dispatch = useDispatch();
  const transactionsState = useSelector(selectTransactionsData);

  console.log("[useTransactions] Current state:", transactionsState);

  const { data, loading, error } = useApi<{
    message?: string;
    data: TransactionData[];
  }>({
    endpoint: "/transactions",
    method: "GET",
    enabled: transactionsState.loaded === false,
  });

  useEffect(() => {
    if (data) {
      console.log("[useTransactions] API response received:", data);
      if (data.data && Array.isArray(data.data)) {
        console.log("[useTransactions] Dispatching setTransactionsData with:", data.data.length, "transactions");
        dispatch(
          setTransactionsData({ items: data.data, loading: false, loaded: true }),
        );
      } else {
        console.warn("[useTransactions] API response data is not an array:", data);
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("[useTransactions] Setting loading state:", loading);
    }
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("[useTransactions] Error fetching transactions:", error);
      dispatch(clearTransactionsData());
    }
  }, [error, dispatch]);
}
