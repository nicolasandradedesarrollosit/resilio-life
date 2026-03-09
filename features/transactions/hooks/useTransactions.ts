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

  useEffect(() => {
    if (error) {
      dispatch(clearTransactionsData());
    }
  }, [error, dispatch]);
}
