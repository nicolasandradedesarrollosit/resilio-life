import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { benefitsService } from "@/features/benefits/services/benefitsService";
import {
  selectBenefitsData,
  setBenefitsData,
  clearBenefitsData,
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

  useEffect(() => {
    if (error) {
      dispatch(clearBenefitsData());
    }
  }, [error, dispatch]);
}
