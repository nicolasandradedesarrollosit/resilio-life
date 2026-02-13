import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { messagesService } from "@/features/messages/services/messagesService";
import {
  selectAllMessages,
  selectLoading,
  selectLoaded,
  setMessages,
  setLoading,
} from "@/features/messages/messageSlice";

export const useMessages = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectAllMessages);
  const loaded = useSelector(selectLoaded);
  const reduxLoading = useSelector(selectLoading);

  useEffect(() => {
    if (loaded) return;

    const fetchMessages = async () => {
      try {
        dispatch(setLoading());

        const response = await messagesService.getAll();

        if (response.data) {
          dispatch(setMessages(response.data));
        }
      } catch {
        // Error handled silently
      }
    };

    fetchMessages();
  }, [loaded, dispatch]);

  return {
    messages,
    loading: reduxLoading && !loaded,
    loaded,
    error: null,
  };
};
