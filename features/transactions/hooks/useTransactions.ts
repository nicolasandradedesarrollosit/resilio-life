import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { transactionsService } from "@/features/transactions/services/transactionsService";
import {
  selectTransactionsData,
  setTransactionsData,
  clearTransactionsData,
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

        if (response.data && Array.isArray(response.data)) {
          dispatch(
            setTransactionsData({ items: response.data, loading: false, loaded: true })
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        dispatch(clearTransactionsData());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTransactions();
  }, [transactionsState.loaded, dispatch]);
}
