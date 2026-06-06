// src/redux/weatherSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentWeather: null,
  forecast: [],
  advisory: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCurrentWeather: (state, action) => {
      state.currentWeather = action.payload;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
    },
    setAdvisory: (state, action) => {
      state.advisory = action.payload;
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
  setCurrentWeather,
  setForecast,
  setAdvisory,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
