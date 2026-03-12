import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function getKey() {
  const key = process.env.ENCRYPTION_KEY || "";
  if (key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-char hex string.");
  }
  return Buffer.from(key, "hex");
}

export function encryptSecret(value: string) {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSecret(value: string) {
  const [ivHex, encryptedHex] = value.split(":");
  const decipher = createDecipheriv(
    "aes-256-cbc",
    getKey(),
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}
