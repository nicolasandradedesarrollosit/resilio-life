import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useApi } from "@/shared/hooks";
import {
  selectHeadquartersData,
  setHeadquartersData,
  clearHeadquartersData,
  setLoading,
} from "@/features/headquarters/headquartersSlice";
import type { HeadquartersData } from "@/shared/types";

export function useSedes() {
  const dispatch = useDispatch();
  const headquartersState = useSelector(selectHeadquartersData);

  console.log("[useSedes] Current state:", headquartersState);

  const { data, loading, error } = useApi<{
    message?: string;
    data: HeadquartersData[];
  }>({
    endpoint: "/headquarters",
    method: "GET",
    enabled: headquartersState.loaded === false,
  });

  useEffect(() => {
    if (data) {
      console.log("[useSedes] API response received:", data);
      if (data.data && Array.isArray(data.data)) {
        console.log("[useSedes] Dispatching setHeadquartersData with:", data.data.length, "headquarters");
        dispatch(
          setHeadquartersData({ items: data.data, loading: false, loaded: true }),
        );
      } else {
        console.warn("[useSedes] API response data is not an array:", data);
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("[useSedes] Setting loading state:", loading);
    }
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("[useSedes] Error fetching headquarters:", error);
      dispatch(clearHeadquartersData());
    }
  }, [error, dispatch]);
}
