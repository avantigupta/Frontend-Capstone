import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";  // Correct import path

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;
