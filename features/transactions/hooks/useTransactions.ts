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

  const { data, loading, error } = useApi<{
    message?: string;
    data: TransactionData[];
  }>({
    endpoint: "/transactions",
    method: "GET",
    enabled: transactionsState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setTransactionsData({ items: data.data, loading: false, loaded: true }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching transactions:", error);
      dispatch(clearTransactionsData());
    }
  }, [error, dispatch]);
}
