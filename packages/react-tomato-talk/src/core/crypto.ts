import CryptoJS from 'crypto-js';

export const encryptMessage = (plainText: string, secretKey?: string): string => {
  if (!secretKey) return plainText;
  try {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
  } catch (err) {
    console.error('[TomatoTalk] Encryption failed:', err);
    return plainText;
  }
};

export const decryptMessage = (cipherText: string, secretKey?: string): string => {
  if (!secretKey) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText;
  } catch (err) {
    // If decryption fails (e.g. invalid key or unencrypted message), return original
    return cipherText;
  }
};
