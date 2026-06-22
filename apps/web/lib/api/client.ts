import axios from "axios";
import { env } from "../config/env"

export const apiClient = axios.create({
    baseURL : env.API_URL,
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
