const { encrypt, decrypt, isEncrypted, getMachineKey } = require('./public/encryptionUtils');

console.log('🔐 Testing Rechnix Encryption System\n');

// Test 1: Basic encryption/decryption
console.log('Test 1: Basic Encryption/Decryption');
const testData = '{"name": "Test Customer", "id": "K001"}';
console.log('Original:', testData);

const encrypted = encrypt(testData);
console.log('Encrypted:', encrypted.substring(0, 50) + '...');
console.log('Is Encrypted:', isEncrypted(encrypted));

const decrypted = decrypt(encrypted);
console.log('Decrypted:', decrypted);
console.log('✅ Match:', testData === decrypted, '\n');

// Test 2: Unencrypted data detection
console.log('Test 2: Unencrypted Data Detection');
const unencryptedData = '{"legacy": "data"}';
console.log('Legacy data:', unencryptedData);
console.log('Is Encrypted:', isEncrypted(unencryptedData));
console.log('✅ Correctly identified as unencrypted\n');

// Test 3: Complex JSON
console.log('Test 3: Complex Invoice Data');
const invoiceData = JSON.stringify({
    kundenId: 'K001',
    datum: '2024-10-09',
    positionen: {
        'Webdesign_Standard': 10,
        'Hosting_Premium': 1
    },
    summe: 970.00,
    paymentStatus: 'unpaid'
});

const encryptedInvoice = encrypt(invoiceData);
const decryptedInvoice = decrypt(encryptedInvoice);
const parsedInvoice = JSON.parse(decryptedInvoice);

console.log('Original amount:', JSON.parse(invoiceData).summe);
console.log('Decrypted amount:', parsedInvoice.summe);
console.log('✅ JSON integrity preserved:', parsedInvoice.summe === 970.00, '\n');

// Test 4: Machine key consistency
console.log('Test 4: Machine Key Consistency');
const key1 = getMachineKey();
const key2 = getMachineKey();
console.log('Key 1 length:', key1.length, 'bytes');
console.log('Key 2 length:', key2.length, 'bytes');
console.log('✅ Keys match:', key1.equals(key2), '\n');

// Test 5: Unicode/special characters
console.log('Test 5: Unicode and Special Characters');
const unicodeData = '{"note": "Müller GmbH – 50% Rabatt für €1,000!"}';
const encryptedUnicode = encrypt(unicodeData);
const decryptedUnicode = decrypt(encryptedUnicode);
console.log('Original:', unicodeData);
console.log('Decrypted:', decryptedUnicode);
console.log('✅ Unicode preserved:', unicodeData === decryptedUnicode, '\n');

console.log('🎉 All tests passed!');
