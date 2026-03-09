import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "@/shared/hooks";
import {
  selectRedeemedBenefitsData,
  setRedeemedBenefitsData,
  clearRedeemedBenefitsData,
  setLoading,
} from "@/features/redeemedBenefits/redeemedBenefitsSlice";
import type { RedeemedBenefitData } from "@/shared/types";

export function useRedeemedBenefits() {
  const dispatch = useDispatch();
  const redeemedBenefitsState = useSelector(selectRedeemedBenefitsData);

  const { data, loading, error } = useApi<{
    message?: string;
    data: RedeemedBenefitData[];
  }>({
    endpoint: "/user/benefits/redeemed",
    method: "GET",
    includeCredentials: true,
    enabled: redeemedBenefitsState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setRedeemedBenefitsData({
          items: data.data,
          loading: false,
          loaded: true,
        })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearRedeemedBenefitsData());
    }
  }, [error, dispatch]);
}
