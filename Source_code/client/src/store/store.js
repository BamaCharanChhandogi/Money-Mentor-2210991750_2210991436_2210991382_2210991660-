import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from './authSlice';
import { BASE_URL } from '../api';

// Function to fetch user data from the backend
async function getUserData(dispatch, token) {
  try {
    const response = await fetch(`${BASE_URL}/auth/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data)); // Update the Redux state with user data
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

const token = localStorage.getItem('token'); // Get token from localStorage

// Initial state for the store
const initialState = {
  auth: {
    isAuthenticated: !!token, // Set to true if token exists
    user: null, // User will be fetched dynamically
    token: token, // Set token
  },
};

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: initialState,
});

// Fetch user data if token exists
if (token) {
  getUserData(store.dispatch, token);
}
