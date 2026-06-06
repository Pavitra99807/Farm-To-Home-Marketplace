// src/redux/farmerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  farmerData: null,
  farmerLocation: null,
  distanceToWarehouse: 0,
  pickupCharge: 0,
  deliveryOption: "self-delivery",
  farmerRating: {
    averageRating: 0,
    level: "Bronze",
    ordersCompleted: 0,
  },
  loading: false,
  error: null,
};

const farmerSlice = createSlice({
  name: "farmer",
  initialState,
  reducers: {
    setFarmerData: (state, action) => {
      state.farmerData = action.payload;
    },
    setFarmerLocation: (state, action) => {
      state.farmerLocation = action.payload;
    },
    setDistanceAndCharge: (state, action) => {
      state.distanceToWarehouse = action.payload.distance;
      state.pickupCharge = action.payload.pickupCharge;
    },
    setDeliveryOption: (state, action) => {
      state.deliveryOption = action.payload;
    },
    setFarmerRating: (state, action) => {
      state.farmerRating = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFarmerData,
  setFarmerLocation,
  setDistanceAndCharge,
  setDeliveryOption,
  setFarmerRating,
  setLoading,
  setError,
  clearError,
} = farmerSlice.actions;

export default farmerSlice.reducer;
