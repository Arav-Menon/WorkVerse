import axios from "axios";
import { services } from "../config/env"

export const apiClient = axios.create({
    baseURL : services.cortex,
    withCredentials : true
})

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
