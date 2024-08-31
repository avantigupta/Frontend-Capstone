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
        console.log(token)
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
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access. Please check your token.');
        } else {
            console.error('Response error:', error);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
