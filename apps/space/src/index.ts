import { workspaceServer } from "./arena-server"
import { client as pubClient } from "@repo/redis"

const PORT = Number(process.env.PORT)
const server = new workspaceServer(PORT, pubClient)
server.start()