import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        }
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem("accessToken");
            window.dispatchEvent(new Event('authChange'));
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default api;