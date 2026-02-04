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

  const { data, loading, error } = useApi<{
    message?: string;
    data: BenefitData[];
  }>({
    endpoint: "/benefits",
    method: "GET",
    enabled: benefitsState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setBenefitsData({ items: data.data, loading: false, loaded: true }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching benefits:", error);
      dispatch(clearBenefitsData());
    }
  }, [error, dispatch]);
}
