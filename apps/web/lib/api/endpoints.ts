export const API_ENDPOINTS = {
    USER: {
        REGISTER : "/api/v1/auth/register",
        LOGIN : "/api/v1/auth/login"
    },
    ORGANIZATION: {
        REGISTER : "/api/v1/register-organization",
        GET_ALL : "/api/v1/organizations",
        GET_BY_ID : (orgId : string) => `/api/v1/organizations/${orgId}`,
        GET_BY_SLUG : (slug : string) => `/api/v1/organizations/slug/${slug}`,
        INVITE : (orgId : string) => `/api/v1/generate-invite-link/${orgId}`,
        INVITE_VALIDATE : (token : string) => `/api/v1/invite/${token}`,
        INVITE_ACCEPT : "/api/v1/accept-invite",
    },
    WORKSPACE: {
        CREATE: (orgId : string) => `/api/v1/register-workspace/${orgId}`,
    },
    PROFILE: {
        ME: "/api/v1/profile/me",
    }
}