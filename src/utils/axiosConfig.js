import axios from 'axios';

// Set the base URL for all axios requests
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Attach the token to the request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Extracted Token:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error('No token found in localStorage');
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
