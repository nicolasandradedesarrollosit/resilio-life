import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { eventsService } from "@/features/events/services/eventsService";
import { selectEventsData } from "@/features/events/eventsSlice";
import {
  setEventsData,
  clearEventsData,
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

        if (response.data && Array.isArray(response.data)) {
          dispatch(
            setEventsData({ events: response.data, loading: false, loaded: true })
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        dispatch(clearEventsData());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchEvents();
  }, [eventsState.loaded, dispatch]);
}
