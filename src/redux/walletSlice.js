// src/redux/walletSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalBalance: 0,
  pendingBalance: 0,
  withdrawnBalance: 0,
  transactions: [],
  withdrawalRequests: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletData: (state, action) => {
      state.totalBalance = action.payload.totalBalance;
      state.pendingBalance = action.payload.pendingBalance;
      state.withdrawnBalance = action.payload.withdrawnBalance;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      state.totalBalance += action.payload.type === "credit" ? action.payload.amount : -action.payload.amount;
    },
    setWithdrawalRequests: (state, action) => {
      state.withdrawalRequests = action.payload;
    },
    addWithdrawalRequest: (state, action) => {
      state.withdrawalRequests.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWalletData,
  setTransactions,
  addTransaction,
  setWithdrawalRequests,
  addWithdrawalRequest,
  setLoading,
  setError,
} = walletSlice.actions;

export default walletSlice.reducer;
