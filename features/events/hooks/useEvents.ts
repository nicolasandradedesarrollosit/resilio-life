"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { eventsService } from "@/features/events/services/eventsService";
import {
  selectEventsData,
  setEventsData,
  setLoading,
} from "@/features/events/eventsSlice";

export function useEvents() {
  const dispatch = useDispatch();
  const eventsState = useSelector(selectEventsData);

  useEffect(() => {
    if (eventsState.loaded) return;

    const fetchEvents = async () => {
      try {
        dispatch(setLoading(true));

        const response = await eventsService.getAll();

        dispatch(
          setEventsData({
            events: response.data,
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

    fetchEvents();
  }, [eventsState.loaded, dispatch]);

  return {
    events: eventsState.events,
    loading: eventsState.loading,
    loaded: eventsState.loaded,
  };
}
