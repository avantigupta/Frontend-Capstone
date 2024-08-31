
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const api = axios.create({
  baseURL: "http://localhost:8086/api/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// Login User (Async Thunk)
export const loginUser = createAsyncThunk(
  "/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/signin", credentials);
      console.log("Login successful:", response.data); 
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.Messsage || "An error occurred";
      console.error("Login failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Register User (Async Thunk)
export const registerUser = createAsyncThunk(
  "registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Slice
const authActions = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    status: "idle",
    error: null,
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; 
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authActions.actions;
export default authActions.reducer;
