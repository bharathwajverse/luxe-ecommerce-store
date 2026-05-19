import axios from 'axios';

// Base URL for our product API
export const API_URL = 'https://dummyjson.com';

// Pre-configured axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
});

export default api;
