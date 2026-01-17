import axios from 'axios';

// Use NEXT_PUBLIC_ prefix for client-side access
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://yt.jinskadamthodu.com/public';

export const publicRequest = axios.create({
  baseURL: baseUrl,
});

export const userRequest = axios.create({
  baseURL: baseUrl,
});

// Interceptors can be added here if you need to handle tokens in the future
userRequest.interceptors.request.use((config) => {
    // Example: const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});