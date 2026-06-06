// src/redux/analyticsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: {
    totalRevenue: 0,
    totalOrders: 0,
    totalFarmers: 0,
    totalCustomers: 0,
    totalProducts: 0,
  },
  charts: {
    monthlySales: [],
    topProducts: [],
    topFarmers: [],
    deliveryRevenue: [],
    pickupRevenue: [],
  },
  loading: false,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setChartData: (state, action) => {
      state.charts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setDashboardData,
  setChartData,
  setLoading,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
