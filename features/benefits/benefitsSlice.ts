import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { BenefitData } from "@/shared/types";

interface BenefitsState {
  items: BenefitData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: BenefitsState = {
  items: [],
  loading: false,
  loaded: false,
};

const benefitsSlice = createSlice({
  name: "benefits",
  initialState,
  reducers: {
    setBenefitsData(
      state,
      action: PayloadAction<{
        items: BenefitData[];
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
    addBenefit(state, action: PayloadAction<BenefitData>) {
      state.items.push(action.payload);
    },
    updateBenefit(state, action: PayloadAction<BenefitData>) {
      const index = state.items.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeBenefit(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b._id !== action.payload);
    },
    clearBenefitsData(state) {
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
  setBenefitsData,
  addBenefit,
  updateBenefit,
  removeBenefit,
  clearBenefitsData,
  setLoading,
} = benefitsSlice.actions;
export default benefitsSlice.reducer;

export const selectBenefitsData = (state: { benefits: BenefitsState }) =>
  state.benefits;
export const selectAllBenefits = (state: { benefits: BenefitsState }) =>
  state.benefits.items;
