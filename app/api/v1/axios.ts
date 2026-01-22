import axios from 'axios';

// 1. MAIN API URL (Includes /api)
export const API_BASE_URL = 'https://devyt.jinskadamthodu.com/public/api';

// 2. IMAGE BASE URL (Excludes /api)
export const IMAGE_BASE_URL = 'https://devyt.jinskadamthodu.com/public';

// 3. Create Axios Instances
export const publicRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const userRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 4. Debugging Interceptor
// This will log the full URL to your console so you can check if it's correct
userRequest.interceptors.request.use((config) => {
    // console.log(`[API Request]: ${config.baseURL}${config.url}`);
    return config;
}, (error) => {
    return Promise.reject(error);
});