import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8086',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response); 
        return response;
    },
    (error) => {
        console.error('Response error:', error); 
        return Promise.reject(error);
    }
);
export default axiosInstance;