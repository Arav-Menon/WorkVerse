import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function registerUser(name : string, email : string, password : string) {
    const res = await apiClient.post(API_ENDPOINTS.USER.REGISTER, {name, email, password});
    return res.data.data.token;
}
export async function loginUser(email : string, password : string) {
    const res = await apiClient.post(API_ENDPOINTS.USER.LOGIN, { email, password});
    return res.data.data.token;
}
