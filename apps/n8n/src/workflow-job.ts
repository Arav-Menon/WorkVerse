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
          "accept": "application/json",
          "X-N8N-API-KEY": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OWFhMGI0ZS1mNTkwLTQyZDAtOTE2Mi0yNDU0MDVmZjA4M2MiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNTVlNDU0OWEtM2M3Yy00ODM5LWE2NDAtZWJkYjQxNmUwNDM3IiwiaWF0IjoxNzgxNTExMDc5LCJleHAiOjE3ODQwODgwMDB9.3BfkwoLhRzuZdOmxHvVMtwEMeyRQmcncZz0Z6uf0YMc`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to create n8n workflow: ${errorMessage} statuscode : ${errorMessage.statuscode}`);
  }
}
