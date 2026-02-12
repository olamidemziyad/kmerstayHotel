import axios from "axios"

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout : 10000,
    headers: {
        'Content-Type': 'application/json',
        /* 'Accept': 'application/json' */
    }
});

// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add any custom logic here before the request is sent
        // For example, you can add an authorization token if needed
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle the error before the request is sent
        return Promise.reject(error);
    }
);
 export default apiClient;