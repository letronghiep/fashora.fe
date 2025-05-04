import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../services/auth/login";
import { getMe } from "../../services/user";
import { handleLogout } from "../../services/auth/logout";

export const loginAuth = createAsyncThunk("login", async (body, thunkApi) => {
  try {
    const response = await login(body);
    if (response.status === 200) {
      const {
        message,
        metadata: { user, tokens },
      } = response;
      return {
        message,
        user,
        tokens,
      };
    } else {
      throw new Error(response.message + ": " + response.status);
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});
export const getAuth = createAsyncThunk("getAuth", async (_, thunkApi) => {
  try {
    const response = await getMe();
    if (response.status === 200) {
      const { message, metadata } = response;
      return {
        message,
        user: metadata.user,
        tokens: metadata.tokens,
      };
    } else {
      const responseError = response.data ? response.data : response;
      throw responseError;
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});
export const logout = createAsyncThunk("logout", async (_, thunkApi) => {
  try {
    const response = await handleLogout();
    if (response.status === 200) {
      return true;
    } else {
      throw new Error(response.message + ": " + response.status);
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});
export const registerAuth = createAsyncThunk(
  "signup",
  async (body, thunkApi) => {
    try {
      const response = await register(body);
      if (response.status === 201) {
        const {
          message,
          metadata: { user, tokens },
        } = response.data;
        return {
          message,
          user,
          tokens,
        };
      } else {
        throw new Error(response.message + ": " + response.status);
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
const INITIAL_STATE = {
  user: {},
  isAuthenticated: false,
  loading: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    logoutAuth: (state) => {
      state.user = {};
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("client_id");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.tokens.accessToken);
        localStorage.setItem("client_id", action.payload.user._id);
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.tokens.accessToken);
        localStorage.setItem("client_id", action.payload.user._id);
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = {};
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem("token");
        localStorage.removeItem("client_id");
      })
      .addCase(getAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.tokens);
        localStorage.setItem("client_id", action.payload.user?._id);
      })
      .addCase(registerAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAuth.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginAuth.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAuth.rejected, (state) => {
        state.loading = false;
        // localStorage.removeItem("token");
        // localStorage.removeItem("client_id");
      });
  },
});

export default authSlice.reducer;
export const { logoutAuth } = authSlice.actions;
