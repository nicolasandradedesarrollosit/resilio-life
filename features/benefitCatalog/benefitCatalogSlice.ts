import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CatalogBenefitData } from "@/shared/types";

interface BenefitCatalogState {
  items: CatalogBenefitData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: BenefitCatalogState = {
  items: [],
  loading: false,
  loaded: false,
};

const benefitCatalogSlice = createSlice({
  name: "benefitCatalog",
  initialState,
  reducers: {
    setBenefitCatalogData(
      state,
      action: PayloadAction<{
        items: CatalogBenefitData[];
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
    addCatalogBenefit(state, action: PayloadAction<CatalogBenefitData>) {
      state.items.push(action.payload);
    },
    removeCatalogBenefit(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x._id !== action.payload);
    },
    clearBenefitCatalogData(state) {
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
  setBenefitCatalogData,
  addCatalogBenefit,
  removeCatalogBenefit,
  clearBenefitCatalogData,
  setLoading,
} = benefitCatalogSlice.actions;

export const selectBenefitCatalogData = (state: {
  benefitCatalog: BenefitCatalogState;
}) => state.benefitCatalog;

export const selectAllCatalogBenefits = (state: {
  benefitCatalog: BenefitCatalogState;
}) => state.benefitCatalog.items;

export default benefitCatalogSlice.reducer;
