import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

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
