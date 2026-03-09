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

  useEffect(() => {
    if (error) {
      dispatch(clearEventsData());
    }
  }, [error, dispatch]);
}
