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

  const { data, loading, error } = useApi<{
    message?: string;
    data: HeadquartersData[];
  }>({
    endpoint: "/headquarters",
    method: "GET",
    enabled: headquartersState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setHeadquartersData({ items: data.data, loading: false, loaded: true }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching headquarters:", error);
      dispatch(clearHeadquartersData());
    }
  }, [error, dispatch]);
}
