import { setEventsData, clearEventsData, setLoading } from "@/redux/eventsSlice";
import { useEffect, useRef } from "react";
import { getEvents } from "@/services/eventService";
import { useDispatch, useSelector } from "react-redux";
import { selectEventsData } from "@/redux/eventsSlice";
import { EventData } from "@/types/EventData.type";

export function useEvents() {
    const dispatch = useDispatch();
    const eventsState = useSelector(selectEventsData);
    const hasFetched = useRef(false);

    useEffect(() => {
        async function fetchEvents() {
            if (eventsState.loaded || eventsState.loading || hasFetched.current) {
                return;
            }
            hasFetched.current = true;
            dispatch(setLoading(true));
            try {
                const events = await getEvents();
                dispatch(setEventsData({ events: events as EventData[], loading: false, loaded: true }));
            } catch (error) {
                dispatch(clearEventsData());
            }
        }
        fetchEvents();
    }, [dispatch]);
}