"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { paymentsService } from "@/features/payments/services/paymentsService";
import {
  selectPaymentsData,
  setPackages,
  setLoading,
} from "@/features/payments/paymentsSlice";

export function usePackages() {
  const dispatch = useDispatch();
  const paymentsState = useSelector(selectPaymentsData);

  useEffect(() => {
    if (paymentsState.loaded) return;

    const fetchPackages = async () => {
      try {
        dispatch(setLoading(true));
        const response = await paymentsService.getPackages();
        dispatch(setPackages(response.data));
      } catch {
        dispatch(setLoading(false));
      }
    };

    fetchPackages();
  }, [paymentsState.loaded, dispatch]);

  return {
    packages: paymentsState.packages,
    loading: paymentsState.loading,
    loaded: paymentsState.loaded,
  };
}
