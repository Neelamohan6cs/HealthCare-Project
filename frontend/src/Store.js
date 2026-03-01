import { configureStore } from "@reduxjs/toolkit";
import healthReducer from "./Slice/healthSlice";

export const store = configureStore({
  reducer: {
    health: healthReducer
  }
});