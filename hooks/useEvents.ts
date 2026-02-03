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

  const { data, loading, error } = useApi<{
    message?: string;
    data: EventData[];
  }>({
    endpoint: "/events",
    method: "GET",
    enabled: eventsState.loaded === false,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      dispatch(
        setEventsData({ events: data.data, loading: false, loaded: true }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching events:", error);
      dispatch(clearEventsData());
    }
  }, [error, dispatch]);
}
