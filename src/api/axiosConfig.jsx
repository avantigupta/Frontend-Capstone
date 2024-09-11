import axios from 'axios';

const BASE_URL = 'http://localhost:8086'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response && error?.response?.status === 401) {
            window.localStorage.clear();
            if (!localStorage.getItem('token')) {
                window.location.href = '/'; 
            }
        } 
        return Promise.reject(error);
    }
);


export default axiosInstance;

