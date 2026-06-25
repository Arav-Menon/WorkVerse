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
          accept: "application/json",
          "X-N8N-API-KEY": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZjc3YzYyYi1kNTNjLTQ4YmEtYjM0MC1hOGY2MzliNDJlODIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNjAzYzA4ZGUtNDE4Ni00YjAyLWEyZTEtZjliNzA2NTYyN2M5IiwiaWF0IjoxNzgyMzkxNDA5LCJleHAiOjE3ODQ5NTIwMDB9.YTWVHJYlkLpxtNxiC6J0C3qeHckExQQW9-f8Ch8aeJI`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(
      `Failed to create n8n workflow: ${errorMessage} statuscode : ${errorMessage.statuscode}`,
    );
  }
}
