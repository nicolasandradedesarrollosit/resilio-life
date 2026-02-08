import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useApi } from "@/shared/hooks";
import {
  selectBenefitsData,
  setBenefitsData,
  clearBenefitsData,
  setLoading,
} from "@/features/benefits/benefitsSlice";
import type { BenefitData } from "@/shared/types";

export function useBenefits() {
  const dispatch = useDispatch();
  const benefitsState = useSelector(selectBenefitsData);

  console.log("[useBenefits] Current state:", benefitsState);

  const { data, loading, error } = useApi<{
    message?: string;
    data: BenefitData[];
  }>({
    endpoint: "/benefits",
    method: "GET",
    enabled: benefitsState.loaded === false,
  });

  useEffect(() => {
    if (data) {
      console.log("[useBenefits] API response received:", data);
      if (data.data && Array.isArray(data.data)) {
        console.log("[useBenefits] Dispatching setBenefitsData with:", data.data.length, "benefits");
        dispatch(
          setBenefitsData({ items: data.data, loading: false, loaded: true }),
        );
      } else {
        console.warn("[useBenefits] API response data is not an array:", data);
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("[useBenefits] Setting loading state:", loading);
    }
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("[useBenefits] Error fetching benefits:", error);
      dispatch(clearBenefitsData());
    }
  }, [error, dispatch]);
}
