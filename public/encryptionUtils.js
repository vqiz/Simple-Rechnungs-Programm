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
const BACKUP_MARKER = 'RECHNIX_BACKUP_V1:';

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

/**
 * Encrypt data with a user-provided password (for backups)
 * @param {string} plaintext - Data to encrypt
 * @param {string} password - User password
 * @returns {string} Encrypted data with backup marker prefix
 */
function encryptWithPassword(plaintext, password) {
    try {
        // Generate random salt for this backup
        const salt = crypto.randomBytes(SALT_LENGTH);

        // Derive key from password
        const key = crypto.pbkdf2Sync(
            password,
            salt,
            PBKDF2_ITERATIONS,
            KEY_LENGTH,
            'sha256'
        );

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const authTag = cipher.getAuthTag();

        // Format: BACKUP_MARKER:Salt:IV:AuthTag:EncryptedData
        const result = BACKUP_MARKER +
            salt.toString('base64') + ':' +
            iv.toString('base64') + ':' +
            authTag.toString('base64') + ':' +
            encrypted;

        return result;
    } catch (error) {
        console.error('Password encryption error:', error);
        throw new Error('Failed to encrypt with password');
    }
}

/**
 * Decrypt data encrypted with encryptWithPassword()
 * @param {string} encryptedData - Data to decrypt (with backup marker prefix)
 * @param {string} password - User password
 * @returns {string} Decrypted plaintext
 */
function decryptWithPassword(encryptedData, password) {
    try {
        // Remove marker prefix
        if (!encryptedData.startsWith(BACKUP_MARKER)) {
            throw new Error('Invalid backup format');
        }

        const data = encryptedData.slice(BACKUP_MARKER.length);
        const parts = data.split(':');

        if (parts.length !== 4) {
            throw new Error('Invalid encrypted backup data format');
        }

        const salt = Buffer.from(parts[0], 'base64');
        const iv = Buffer.from(parts[1], 'base64');
        const authTag = Buffer.from(parts[2], 'base64');
        const encrypted = parts[3];

        // Derive key from password with extracted salt
        const key = crypto.pbkdf2Sync(
            password,
            salt,
            PBKDF2_ITERATIONS,
            KEY_LENGTH,
            'sha256'
        );

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Password decryption error:', error);
        if (error.message.includes('bad decrypt')) {
            throw new Error('Incorrect password or corrupted backup');
        }
        throw new Error('Failed to decrypt backup');
    }
}

/**
 * Check if data is a password-encrypted backup
 * @param {string} data - Data to check
 * @returns {boolean} True if data is a backup
 */
function isBackupEncrypted(data) {
    return typeof data === 'string' && data.startsWith(BACKUP_MARKER);
}

module.exports = {
    encrypt,
    decrypt,
    isEncrypted,
    encryptWithPassword,
    decryptWithPassword,
    isBackupEncrypted,
    getMachineKey // Export for testing purposes
};
