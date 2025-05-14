import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

export interface googleLoginResponse {
  token: string;
}

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: UserState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
};


export const login = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Login failed.");
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (
    {
      first_name,
      last_name,
      email,
      password,
    }: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(
        first_name,
        last_name,
        email,
        password
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "Registration failed."
      );
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Logout failed.");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/google",
  async ({ accessToken }: { accessToken: string }, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(accessToken);
      return response;
    } catch (err) {
      console.error("Google Auth Error", err);
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.token = null;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { data, message } = action.payload;
        localStorage.setItem("token", data.token);
        state.token = data.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.success = message;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while login.";
      })

      // Register
      .addCase(register.pending, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.token = data.token;
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
        state.success = "Registration successful, please login to continue.";
      })
      .addCase(register.rejected, (state, action) => {
        state.token = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while registration.";
      })

      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.token = null;
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        const { data, message } = action.payload;
        localStorage.setItem("token", data.token);
        state.token = data.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.success = message;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.token = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.success = null;
        state.error = (action.payload as string) || "Error while login.";
      })

      // Log out
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("token")
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.success = "Logout successful.";
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.success = null;
        state.error = "Error while logging out.";
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;
