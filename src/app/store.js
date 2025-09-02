import { configureStore } from "@reduxjs/toolkit";
import modqueueReducer from "../features/modqueue/modqueueSlice";

export const store = configureStore({
  reducer: {
    modqueue: modqueueReducer,
  },
});
