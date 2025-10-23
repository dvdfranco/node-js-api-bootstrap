import crypto from 'crypto';

//ChatGPT did all this stuff! o.O

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Derives a key from a hash value
 */
function deriveKey(hash: string): Buffer {
  return crypto.createHash('sha256').update(hash).digest();
}

export function encrypt(text: string): string {
  const hash = process.env['ENCRYPTION_HASH'] as string;
  const key = deriveKey(hash);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Prepend IV to encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string): string {
  const hash = process.env['ENCRYPTION_HASH'] as string;
  const key = deriveKey(hash);
  const parts = encryptedData.split(':');
  console.log("data", encryptedData);
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

