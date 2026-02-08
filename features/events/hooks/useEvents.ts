import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useApi } from "@/shared/hooks";

import { selectEventsData } from "@/features/events/eventsSlice";
import {
  setEventsData,
  clearEventsData,
  setLoading,
} from "@/features/events/eventsSlice";
import type { EventData } from "@/shared/types";

export function useEvents() {
  const dispatch = useDispatch();
  const eventsState = useSelector(selectEventsData);

  console.log("[useEvents] Current state:", eventsState);

  const { data, loading, error } = useApi<{
    message?: string;
    data: EventData[];
  }>({
    endpoint: "/events",
    method: "GET",
    enabled: eventsState.loaded === false,
  });

  useEffect(() => {
    if (data) {
      console.log("[useEvents] API response received:", data);
      if (data.data && Array.isArray(data.data)) {
        console.log("[useEvents] Dispatching setEventsData with:", data.data.length, "events");
        dispatch(
          setEventsData({ events: data.data, loading: false, loaded: true }),
        );
      } else {
        console.warn("[useEvents] API response data is not an array:", data);
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("[useEvents] Setting loading state:", loading);
    }
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("[useEvents] Error fetching events:", error);
      dispatch(clearEventsData());
    }
  }, [error, dispatch]);
}
