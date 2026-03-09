import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MapLocationData } from "@/shared/types";

interface MapLocationsState {
  items: MapLocationData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: MapLocationsState = {
  items: [],
  loading: false,
  loaded: false,
};

const mapLocationsSlice = createSlice({
  name: "mapLocations",
  initialState,
  reducers: {
    setMapLocationsData(
      state,
      action: PayloadAction<{
        items: MapLocationData[];
        loading?: boolean;
        loaded?: boolean;
      }>
    ) {
      state.items = action.payload.items;
      if (action.payload.loading !== undefined)
        state.loading = action.payload.loading;
      if (action.payload.loaded !== undefined)
        state.loaded = action.payload.loaded;
    },
    addMapLocation(state, action: PayloadAction<MapLocationData>) {
      state.items.push(action.payload);
    },
    removeMapLocation(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x._id !== action.payload);
    },
    clearMapLocationsData(state) {
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
  setMapLocationsData,
  addMapLocation,
  removeMapLocation,
  clearMapLocationsData,
  setLoading,
} = mapLocationsSlice.actions;

export const selectMapLocationsData = (state: {
  mapLocations: MapLocationsState;
}) => state.mapLocations;

export const selectAllMapLocations = (state: {
  mapLocations: MapLocationsState;
}) => state.mapLocations.items;

export default mapLocationsSlice.reducer;
