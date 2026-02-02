const crypto = require('crypto');
const { machineIdSync } = require('node-machine-id');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;
const ENCRYPTION_MARKER = 'RECHNIX_ENC_V1:';

/**
 * Get a consistent machine-specific encryption key
 * @returns {Buffer} 32-byte encryption key
 */
function getMachineKey() {
    try {
        // Get machine ID (based on MAC address, hostname, etc.)
        const machineId = machineIdSync({ original: true });

        // Use a fixed salt derived from the machine ID itself
        // This ensures the same machine always generates the same key
        const fixedSalt = crypto.createHash('sha256')
            .update(machineId)
            .digest();

        // Derive a 32-byte key using PBKDF2
        const key = crypto.pbkdf2Sync(
            machineId,
            fixedSalt,
            PBKDF2_ITERATIONS,
            KEY_LENGTH,
            'sha256'
        );

        return key;
    } catch (error) {
        console.error('Error generating machine key:', error);
        throw new Error('Failed to generate encryption key');
    }
}

/**
 * Encrypt data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted data with marker prefix
 */
function encrypt(plaintext) {
    try {
        const key = getMachineKey();
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const authTag = cipher.getAuthTag();

        // Format: MARKER:IV:AuthTag:EncryptedData
        const result = ENCRYPTION_MARKER +
            iv.toString('base64') + ':' +
            authTag.toString('base64') + ':' +
            encrypted;

        return result;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt data encrypted with encrypt()
 * @param {string} encryptedData - Data to decrypt (with marker prefix)
 * @returns {string} Decrypted plaintext
 */
function decrypt(encryptedData) {
    try {
        // Remove marker prefix
        if (!encryptedData.startsWith(ENCRYPTION_MARKER)) {
            throw new Error('Invalid encryption format');
        }

        const data = encryptedData.slice(ENCRYPTION_MARKER.length);
        const parts = data.split(':');

        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(parts[0], 'base64');
        const authTag = Buffer.from(parts[1], 'base64');
        const encrypted = parts[2];

        const key = getMachineKey();
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Check if data is encrypted
 * @param {string} data - Data to check
 * @returns {boolean} True if data is encrypted
 */
function isEncrypted(data) {
    return typeof data === 'string' && data.startsWith(ENCRYPTION_MARKER);
}

module.exports = {
    encrypt,
    decrypt,
    isEncrypted,
    getMachineKey // Export for testing purposes
};
