import crypto from "crypto";

export function tokenId() {
  const promptId = crypto.randomUUID();
  return promptId;
}