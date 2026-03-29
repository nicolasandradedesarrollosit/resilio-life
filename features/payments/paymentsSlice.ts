import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { PointsPackageData } from "./types/payments.types";

interface PaymentsState {
  packages: PointsPackageData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: PaymentsState = {
  packages: [],
  loading: false,
  loaded: false,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPackages(state, action: PayloadAction<PointsPackageData[]>) {
      state.packages = action.payload;
      state.loaded = true;
      state.loading = false;
    },
    clearPackages(state) {
      state.packages = [];
      state.loaded = false;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setPackages, clearPackages, setLoading } = paymentsSlice.actions;
export default paymentsSlice.reducer;

export const selectPaymentsData = (state: { payments: PaymentsState }) =>
  state.payments;
