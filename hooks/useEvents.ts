import { setEventsData, clearEventsData, setLoading } from "@/redux/eventsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEventsData } from "@/redux/eventsSlice";
import { useApi } from "./useApi";
import { EventData } from "@/types/EventData.type";

export function useEvents() {
    const dispatch = useDispatch();
    const eventsState = useSelector(selectEventsData);

    const { data, loading, error } = useApi<EventData[]>({
        endpoint: '/events',
        method: 'GET',
        enabled: eventsState.loaded === false,
    });

    useEffect(() => {
        if (data && data.length > 0) {
            dispatch(setEventsData({ events: data, loading: false, loaded: true }));
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