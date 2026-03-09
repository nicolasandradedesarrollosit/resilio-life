import type { RootState } from "@/shared/store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavbarState {
  isNavOpen: boolean;
}

const initialState: NavbarState = {
  isNavOpen: true, // Default as requested in the old context
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setNavOpen: (state, action: PayloadAction<boolean>) => {
      state.isNavOpen = action.payload;
    },
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen;
    },
  },
});

export const { setNavOpen, toggleNav } = navbarSlice.actions;
export default navbarSlice.reducer;

export const selectIsNavOpen = (state: RootState) => state.navbar.isNavOpen;
