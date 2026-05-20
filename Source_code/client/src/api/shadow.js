import axios from 'axios';
import { BASE_URL } from './index.js';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

/**
 * Fetch the full AI Shadow report (spending patterns, 14-day simulation, shortfalls).
 * This may take a few seconds as it calls Gemini for narrative generation.
 */
export const fetchShadowReport = async () => {
  const response = await axios.get(`${BASE_URL}/shadow/report`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Dismiss an alert by ID. Server acknowledges; client persists in localStorage.
 */
export const dismissShadowAlert = async (alertId) => {
  const response = await axios.post(
    `${BASE_URL}/shadow/dismiss`,
    { alertId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
