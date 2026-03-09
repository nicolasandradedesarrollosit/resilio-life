import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "@/shared/hooks";
import {
  selectMapLocationsData,
  setMapLocationsData,
  clearMapLocationsData,
  setLoading,
} from "@/features/mapLocations/mapLocationsSlice";
import type { MapLocationData } from "@/shared/types";

export function useMapLocations() {
  const dispatch = useDispatch();
  const mapLocationsState = useSelector(selectMapLocationsData);

  const { data, loading, error } = useApi<{
    message?: string;
    data: MapLocationData[];
  }>({
    endpoint: "/user/map/locations",
    method: "GET",
    includeCredentials: true,
    enabled: mapLocationsState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setMapLocationsData({ items: data.data, loading: false, loaded: true })
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearMapLocationsData());
    }
  }, [error, dispatch]);
}
