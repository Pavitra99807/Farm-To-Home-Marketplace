// src/redux/trackingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  selectedOrder: null,
  trackingStatus: null,
  timeline: [],
  loading: false,
};

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setTrackingStatus: (state, action) => {
      state.trackingStatus = action.payload;
    },
    setTimeline: (state, action) => {
      state.timeline = action.payload;
    },
    updateTimeline: (state, action) => {
      state.timeline.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setOrders,
  setSelectedOrder,
  setTrackingStatus,
  setTimeline,
  updateTimeline,
  setLoading,
} = trackingSlice.actions;

export default trackingSlice.reducer;
