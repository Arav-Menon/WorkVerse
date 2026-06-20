export const API_ENDPOINTS = {
    USER: {
        REGISTER : "/api/v1/auth/register",
        LOGIN : "/api/v1/auth/login"
    },
    ORGANIZATION: {
        REGISTER : "/api/v1/register-organization"
    },
    WORKSPACE: {
        CREATE: (orgId : string) => `/api/v1/register-workspace/${orgId}`,
    }
}