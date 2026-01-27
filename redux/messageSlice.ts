import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MessageState, MessageData } from "@/types/messageData.type";

const initialState: MessageState = {
  messages: [],
  loading: false,
  loaded: false,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessageData[]>) => {
      state.messages = action.payload;
      state.loading = false;
      state.loaded = true;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setMessages, setLoading } = messageSlice.actions;
export default messageSlice.reducer;

export const selectAllMessages = (state: { messages: MessageState }) =>
  state.messages.messages;
export const selectLoading = (state: { messages: MessageState }) =>
  state.messages.loading;
export const selectLoaded = (state: { messages: MessageState }) =>
  state.messages.loaded;
