"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { transactionsService } from "@/features/transactions/services/transactionsService";
import {
  selectTransactionsData,
  setTransactionsData,
  setLoading,
} from "@/features/transactions/transactionsSlice";

export function useTransactions() {
  const dispatch = useDispatch();
  const transactionsState = useSelector(selectTransactionsData);

  useEffect(() => {
    if (transactionsState.loaded) return;

    const fetchTransactions = async () => {
      try {
        dispatch(setLoading(true));

        const response = await transactionsService.getAll();

        dispatch(
          setTransactionsData({
            items: response.data,
            loading: false,
            loaded: true,
          }),
        );
      } catch {
        dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTransactions();
  }, [transactionsState.loaded, dispatch]);

  return {
    transactions: transactionsState.items,
    loading: transactionsState.loading,
    loaded: transactionsState.loaded,
  };
}
