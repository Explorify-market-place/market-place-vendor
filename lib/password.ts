import { createHash, randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${hash.toString("hex")}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const [salt, hash] = hashedPassword.split(":");
    if (!salt || !hash) return false;
    
    const verifyHash = await pbkdf2Async(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
    return hash === verifyHash.toString("hex");
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
