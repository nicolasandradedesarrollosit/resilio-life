import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllMessages, selectLoading, selectLoaded, setMessages, setLoading } from "@/redux/messageSlice";
import { useApi } from "./useApi";
import { MessageResponse } from "@/types/messageData.type";

export const useMessages = () => {
    const dispatch = useDispatch();
    const messages = useSelector(selectAllMessages);
    const loaded = useSelector(selectLoaded);
    const reduxLoading = useSelector(selectLoading);

    const { data, loading: apiLoading, error } = useApi<MessageResponse>({
        endpoint: '/messages',
        method: 'GET',
        enabled: !loaded,
    });

    useEffect(() => {
        if (data && !loaded) {
            dispatch(setMessages(data.data));
        }
    }, [data, loaded, dispatch]);

    useEffect(() => {
        if (apiLoading && !reduxLoading && !loaded) {
            dispatch(setLoading());
        }
    }, [apiLoading, reduxLoading, loaded, dispatch]);

    return {
        messages,
        loading: apiLoading || (reduxLoading && !loaded),
        loaded,
        error
    };
}