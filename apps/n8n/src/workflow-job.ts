import axios from "axios";
import { N8N_URL } from "../utils/n8n_url";
interface N8nWorkflowResponse {
  id: string;
  name: string;
}

export async function createWorkflow(
  workflowJson: object,
): Promise<N8nWorkflowResponse> {
  try {
    const response = await axios.post<N8nWorkflowResponse>(
      N8N_URL,
      workflowJson,
      {
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": process.env.N8N_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWZmYTYzMC02OTlmLTQxYzktOTU5ZC0wODgyN2EyM2Y0MmQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzM2NGUwZGUtZGNiOS00MzIwLTgxYTQtOGMwNTY5M2YzN2YzIiwiaWF0IjoxNzc2Nzg5OTEzLCJleHAiOjE3NzkzMzYwMDB9.IuaknghKVnG2u61WKBE593m3vJVr1loTHDh9eqtjMDo"
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to create n8n workflow: ${errorMessage}`);
  }
}
