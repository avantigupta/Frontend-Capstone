// src/utils/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8086', // Your Spring Boot backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
