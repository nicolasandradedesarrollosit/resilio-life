import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "@/shared/hooks";
import {
  selectBenefitCatalogData,
  setBenefitCatalogData,
  clearBenefitCatalogData,
  setLoading,
} from "@/features/benefitCatalog/benefitCatalogSlice";
import type { CatalogBenefitData } from "@/shared/types";

export function useBenefitCatalog() {
  const dispatch = useDispatch();
  const benefitCatalogState = useSelector(selectBenefitCatalogData);

  const { data, loading, error } = useApi<{
    message?: string;
    data: CatalogBenefitData[];
  }>({
    endpoint: "/user/benefits",
    method: "GET",
    includeCredentials: true,
    enabled: benefitCatalogState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setBenefitCatalogData({ items: data.data, loading: false, loaded: true })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearBenefitCatalogData());
    }
  }, [error, dispatch]);
}
