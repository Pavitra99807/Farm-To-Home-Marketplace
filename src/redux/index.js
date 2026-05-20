import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlice';
import userReducer from "./userSlice";

import Checkout from "../page/Checkout";

export const store = configureStore({
  reducer: {
    product:productReducer,
    user: userReducer,
  },
})
