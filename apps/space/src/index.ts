import { workspaceServer } from "./arena-server"
import { client as pubClient } from "@repo/redis"

const PORT = Number(process.env.PORT ?? 8002)
const server = new workspaceServer(PORT, pubClient)
server.start()