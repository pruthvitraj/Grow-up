import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Add token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Add error handling with toast notifications
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong! Please try again.";

        toast.error(message);
        return Promise.reject(error);
    }
);

export default api;
