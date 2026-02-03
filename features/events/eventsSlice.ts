import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { EventData } from "@/shared/types";

interface EventsState {
  events: Array<EventData>;
  loading: boolean;
  loaded: boolean;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  loaded: false,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsData(
      state,
      action: PayloadAction<{
        events: Array<EventData>;
        loading?: boolean;
        loaded?: boolean;
      }>,
    ) {
      state.events = action.payload.events;
      if (action.payload.loading !== undefined)
        state.loading = action.payload.loading;
      if (action.payload.loaded !== undefined)
        state.loaded = action.payload.loaded;
    },
    addEvent(state, action: PayloadAction<EventData>) {
      state.events.push(action.payload);
    },
    updateEvent(state, action: PayloadAction<EventData>) {
      const index = state.events.findIndex((e) => e._id === action.payload._id);

      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    clearEventsData(state) {
      state.events = [];
      state.loaded = false;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setEventsData,
  addEvent,
  updateEvent,
  clearEventsData,
  setLoading,
} = eventsSlice.actions;
export default eventsSlice.reducer;

export const selectEventsData = (state: { events: EventsState }) =>
  state.events;
export const selectAllEvents = (state: { events: EventsState }) =>
  state.events.events;
