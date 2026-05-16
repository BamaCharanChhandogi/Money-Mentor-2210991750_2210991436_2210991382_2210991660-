import axios from "axios";

// export const BASE_URL = 'https://money-mentor-1f1e.onrender.com/api';
export const BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const register = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-otp`, data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await axios.get(`${BASE_URL}/auth/get-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};
// edit user profile
export const editUser = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`${BASE_URL}/auth/update-user`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};
// delete user profile
export const deleteUser = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${BASE_URL}/auth/delete-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
}

// Join family via token
export const joinFamily = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${BASE_URL}/family-groups/join`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

