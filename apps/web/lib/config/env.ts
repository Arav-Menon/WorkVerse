export const env = {
    API_URL: process.env.API_URL || "http://localhost:3000",
    WS_URL: process.env.WS_URL || "ws://localhost:8080",
    RELAY_URL: process.env.RELAY_URL || "ws://localhost:8089",
    SPACE_WS_URL: process.env.SPACE_WS_URL || "ws://localhost:8002",
    SYNAPSE_WS_URL: process.env.SYNAPSE_WS_URL || "ws://localhost:8001",
}