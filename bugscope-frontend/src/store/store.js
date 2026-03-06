import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import errorReducer from "./errorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    errors: errorReducer
  }
});