import axios from 'axios';

// todo: put baseURL inside environment file
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Symfony API Platform base
  headers: {
    'Accept': 'application/ld+json',
    'Content-Type': 'application/ld+json',
  },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})
