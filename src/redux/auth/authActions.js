// import { LOGIN, LOGOUT } from "./authTypes";
// import axiosInstance from '../../utils/axiosConfig';

// export const loginUser = (user) => async (dispatch) => {
//     try {
//         const response = await axiosInstance.post('/auth/login', {
//           user
//         });

//         const { id, name,email,role, token } = response.data;

//         dispatch({
//             type: LOGIN,
//             payload: {
//                 id,
//                 name,
//                 email,
//                 role,
//                 token,
//             },
//         });

//         // Store token in localStorage
//         localStorage.setItem('token', token);

//     } catch (error) {
//         console.error('Login failed:', error);

//         if (error.response && error.response.data) {
//             alert(`Login failed: ${error.response.data.message}`);
//         } else {
//             alert('Login failed due to a server error. Please try again later.');
//         }

//         throw error;
//     }
// };

// export const logoutUser = () => {
//     localStorage.removeItem('token');
//     return {
//         type: LOGOUT,
//     };
// };
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8086/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
// Login User (Async Thunk)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
// Register User (Async Thunk)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/signup", userData);
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
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      // Optionally clear token from localStorage or cookies
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
        // Save token in localStorage or cookies if needed
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