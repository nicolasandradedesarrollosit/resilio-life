import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { TransactionData } from "@/shared/types";

interface TransactionsState {
  items: TransactionData[];
  loading: boolean;
  loaded: boolean;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  loaded: false,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionsData(
      state,
      action: PayloadAction<{
        items: TransactionData[];
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
    addTransaction(state, action: PayloadAction<TransactionData>) {
      state.items.push(action.payload);
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
    clearTransactionsData(state) {
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
  setTransactionsData,
  addTransaction,
  removeTransaction,
  clearTransactionsData,
  setLoading,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;

export const selectTransactionsData = (state: { transactions: TransactionsState }) =>
  state.transactions;
export const selectAllTransactions = (state: { transactions: TransactionsState }) =>
  state.transactions.items;
