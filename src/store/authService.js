import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
    }
  }
});

export const { 
  setUser, 
  setLoading, 
  setError, 
  clearError, 
  logout,
  updateUserProfile
} = authSlice.actions;

export default authSlice.reducer;