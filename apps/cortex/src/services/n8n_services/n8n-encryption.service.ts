import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SEPARATOR = ":";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.N8N_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error(
      "N8N_ENCRYPTION_KEY environment variable is required. Generate one with: openssl rand -hex 32"
    );
  }
  if (keyHex.length !== 64) {
    throw new Error("N8N_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  }
  return Buffer.from(keyHex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(SEPARATOR);
}

export function decrypt(composite: string): string {
  const key = getEncryptionKey();
  const parts = composite.split(SEPARATOR);
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format");
  }

  const iv = Buffer.from(parts[0]!, "base64");
  const authTag = Buffer.from(parts[1]!, "base64");
  const encrypted = Buffer.from(parts[2]!, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "********";
  }
  const visibleChars = 4;
  const masked = "*".repeat(apiKey.length - visibleChars);
  return masked + apiKey.slice(-visibleChars);
}
