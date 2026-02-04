import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { HeadquartersData } from "@/shared/types";

interface HeadquartersState {
  items: HeadquartersData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: HeadquartersState = {
  items: [],
  loading: false,
  loaded: false,
};

const headquartersSlice = createSlice({
  name: "headquarters",
  initialState,
  reducers: {
    setHeadquartersData(
      state,
      action: PayloadAction<{
        items: HeadquartersData[];
        loading?: boolean;
        loaded?: boolean;
      }>,
    ) {
      state.items = action.payload.items;
      if (action.payload.loading !== undefined)
        state.loading = action.payload.loading;
      if (action.payload.loaded !== undefined)
        state.loaded = action.payload.loaded;
    },
    addHeadquarters(state, action: PayloadAction<HeadquartersData>) {
      state.items.push(action.payload);
    },
    updateHeadquarters(state, action: PayloadAction<HeadquartersData>) {
      const index = state.items.findIndex((h) => h._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeHeadquarters(state, action: PayloadAction<string>) {
      state.items = state.items.filter((h) => h._id !== action.payload);
    },
    clearHeadquartersData(state) {
      state.items = [];
      state.loaded = false;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setHeadquartersData,
  addHeadquarters,
  updateHeadquarters,
  removeHeadquarters,
  clearHeadquartersData,
  setLoading,
} = headquartersSlice.actions;
export default headquartersSlice.reducer;

export const selectHeadquartersData = (state: { headquarters: HeadquartersState }) =>
  state.headquarters;
export const selectAllHeadquarters = (state: { headquarters: HeadquartersState }) =>
  state.headquarters.items;
