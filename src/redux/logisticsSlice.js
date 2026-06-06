// src/redux/logisticsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickupCharge: 0,
  deliveryCharge: 0,
  totalCost: 0,
  farmerDistance: 0,
  customerDistance: 0,
  warehouseLocation: null,
  loading: false,
};

const logisticsSlice = createSlice({
  name: "logistics",
  initialState,
  reducers: {
    setPickupCharge: (state, action) => {
      state.pickupCharge = action.payload;
    },
    setDeliveryCharge: (state, action) => {
      state.deliveryCharge = action.payload;
    },
    setTotalCost: (state, action) => {
      state.totalCost = action.payload;
    },
    setDistances: (state, action) => {
      state.farmerDistance = action.payload.farmerDistance;
      state.customerDistance = action.payload.customerDistance;
    },
    setWarehouseLocation: (state, action) => {
      state.warehouseLocation = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    calculateTotalCost: (state) => {
      state.totalCost = state.pickupCharge + state.deliveryCharge;
    },
  },
});

export const {
  setPickupCharge,
  setDeliveryCharge,
  setTotalCost,
  setDistances,
  setWarehouseLocation,
  setLoading,
  calculateTotalCost,
} = logisticsSlice.actions;

export default logisticsSlice.reducer;
