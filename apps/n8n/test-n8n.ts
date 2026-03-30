import axios from "axios";

const N8N_URL = "http://localhost:5678/api/v1/workflows";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiODIwMGVmOC1mM2ZkLTQ5OTYtOTk5Zi03ODRhOTEwMzdhMGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMmY1YTA1ZDAtMzgxOC00ZTZhLTlkNDctOWU3ZDg0MWMxZTkyIiwiaWF0IjoxNzc0NzgwNzY0LCJleHAiOjE3NzczNDg4MDB9.wjE3hPh5H0WBsMCqwzulFlUduMbkliQ6hwrUAs7LvWs";

const workflowData = {
  name: "Backend Test Workflow",
  nodes: [
    {
      parameters: {},
      id: "cron-node",
      name: "Cron1",
      type: "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [250, 300],
    },
    {
      parameters: {
        assignments: {
          assignments: [
            {
              name: "message",
              value: "Hello from backend",
              type: "string",
            },
          ],
        },
      },
      id: "set-node",
      name: "Set1",
      type: "n8n-nodes-base.set",
      typeVersion: 2,
      position: [500, 300],
    },
  ],
  connections: {
    Cron1: {
      main: [
        [
          {
            node: "Set1",
            type: "main",
            index: 0,
          },
        ],
      ],
    },
  },
  settings: {},
};

async function createWorkflow() {
  try {
    const response = await axios.post(N8N_URL, workflowData, {
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": API_KEY,
      },
    });

    console.log("✅ Workflow Created:");
    console.log(response.data);
  } catch (error: any) {
    console.error("❌ Error:");
    console.error(error.response?.data || error.message);
  }
}

createWorkflow();
