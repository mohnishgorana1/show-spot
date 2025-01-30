import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/logout");

      if (!data.success) {
        throw new Error("Failed to logout");
      }

      localStorage.removeItem("user");
      // localStorage.removeItem("authToken");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/auth/check-auth");
      console.log("data checkauth", data);

      if (!data.success) throw new Error("Not authenticated");

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/api/auth/login", credentials);
    console.log("data", data);

    if (!data.success) throw new Error(data.message || "Login failed");

    // Store token in localStorage

    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user; // Assuming the API returns the user object
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // console.log("login fulfilled see payload", action.payload);
        // console.log("login fulfilled see state", state);
        state.user = action.payload;

        // state.user = {
        //   id: action.payload.id,
        //   email: action.payload.email,
        //   name: action.payload.name,
        //   role: action.payload.role,
        // };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // handle logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   handle auth cheking
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        // console.log("checkAuth payload of redux", action.payload);
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
