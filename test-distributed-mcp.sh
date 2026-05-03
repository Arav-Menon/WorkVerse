#!/bin/bash

ORION_URL="http://localhost:3002"

echo "1. Registering 'add-two-numbers' tool..."
curl -s -X POST "$ORION_URL/api/v1/orion/admin/register-tool" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "add-two-numbers",
    "name": "add-two-numbers",
    "category": "comms",
    "description": "Adds two numbers together",
    "workerId": "comms-worker-local",
    "inputSchema": {
      "type": "object",
      "properties": {
        "a": { "type": "number" },
        "b": { "type": "number" }
      },
      "required": ["a", "b"]
    }
  }'

echo -e "\n\n2. Executing tool 'add-two-numbers' (10 + 20)..."
EXEC_RESPONSE=$(curl -s -X POST "$ORION_URL/api/v1/orion/tools/add-two-numbers/execute" \
  -H "Content-Type: application/json" \
  -d '{ "input": { "a": 10, "b": 20 } }')

echo "Execution Response: $EXEC_RESPONSE"

CORR_ID=$(echo $EXEC_RESPONSE | grep -o '"correlationId":"[^"]*' | cut -d'"' -f4)

if [ -z "$CORR_ID" ]; then
  echo "Error: Could not get correlationId"
  exit 1
fi

echo "Correlation ID: $CORR_ID"

echo -e "\n3. Polling for result (waiting 5 seconds)..."
sleep 5

RESULT=$(curl -s -X GET "$ORION_URL/api/v1/orion/results/$CORR_ID")
echo "Final Result: $RESULT"
