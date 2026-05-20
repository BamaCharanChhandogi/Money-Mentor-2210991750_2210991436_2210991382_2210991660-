import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null, // Start with no user
  token: null, // Token will be set after login
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user; // Set user data
      state.token = action.payload.token; // Set token
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token from localStorage
    },
    setUser(state, action) {
      state.user = action.payload; // Update user dynamically after fetch
    },
  },
});

export const { loginSuccess, logoutSuccess, setUser } = authSlice.actions;
export default authSlice.reducer;
