import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RedeemedBenefitData } from "@/shared/types";

interface RedeemedBenefitsState {
  items: RedeemedBenefitData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: RedeemedBenefitsState = {
  items: [],
  loading: false,
  loaded: false,
};

const redeemedBenefitsSlice = createSlice({
  name: "redeemedBenefits",
  initialState,
  reducers: {
    setRedeemedBenefitsData(
      state,
      action: PayloadAction<{
        items: RedeemedBenefitData[];
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
    addRedeemedBenefit(state, action: PayloadAction<RedeemedBenefitData>) {
      state.items.push(action.payload);
    },
    removeRedeemedBenefit(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x._id !== action.payload);
    },
    clearRedeemedBenefitsData(state) {
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
  setRedeemedBenefitsData,
  addRedeemedBenefit,
  removeRedeemedBenefit,
  clearRedeemedBenefitsData,
  setLoading,
} = redeemedBenefitsSlice.actions;

export const selectRedeemedBenefitsData = (state: {
  redeemedBenefits: RedeemedBenefitsState;
}) => state.redeemedBenefits;

export const selectAllRedeemedBenefits = (state: {
  redeemedBenefits: RedeemedBenefitsState;
}) => state.redeemedBenefits.items;

export default redeemedBenefitsSlice.reducer;
