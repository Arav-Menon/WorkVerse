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
          "X-N8N-API-KEY": process.env.API_KEY,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Failed to create n8n workflow: ${errorMessage}`);
  }
}
