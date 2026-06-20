import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface User {
    name : string,
    email : string,
    password : string
}

export async function authUser(data : User) {
    const res = await apiClient.post(API_ENDPOINTS.USER.REGISTER, data);
    console.log(res.data)
    return res.data;
}

