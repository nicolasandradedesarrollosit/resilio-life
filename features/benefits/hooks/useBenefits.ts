"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { benefitsService } from "@/features/benefits/services/benefitsService";
import {
  selectBenefitsData,
  setBenefitsData,
  setLoading,
} from "@/features/benefits/benefitsSlice";

export function useBenefits() {
  const dispatch = useDispatch();
  const benefitsState = useSelector(selectBenefitsData);

  useEffect(() => {
    if (benefitsState.loaded) return;

    const fetchBenefits = async () => {
      try {
        dispatch(setLoading(true));

        const response = await benefitsService.getAll();

        dispatch(
          setBenefitsData({
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

    fetchBenefits();
  }, [benefitsState.loaded, dispatch]);

  return {
    benefits: benefitsState.items,
    loading: benefitsState.loading,
    loaded: benefitsState.loaded,
  };
}
