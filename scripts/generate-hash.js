#!/usr/bin/env node

/**
 * Password Hash Generator for Agent Mission Control
 * 
 * Usage: node generate-hash.js <password>
 * 
 * This generates a PBKDF2 hash suitable for Cloudflare Workers.
 * The format is: iterations:salt:hash (base64)
 */

const crypto = require('crypto');

function generateHash(password) {
  const iterations = 100000;
  const saltLength = 32;
  const keyLength = 32;
  
  // Generate random salt
  const salt = crypto.randomBytes(saltLength);
  
  // Derive key using PBKDF2
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
  
  // Format: iterations:salt:hash
  const result = `${iterations}:${salt.toString('base64')}:${hash.toString('base64')}`;
  
  return result;
}

function verifyHash(password, hashString) {
  const [iterations, saltBase64, hashBase64] = hashString.split(':');
  const salt = Buffer.from(saltBase64, 'base64');
  const expectedHash = Buffer.from(hashBase64, 'base64');
  
  const derivedHash = crypto.pbkdf2Sync(
    password, 
    salt, 
    parseInt(iterations), 
    expectedHash.length, 
    'sha256'
  );
  
  return derivedHash.equals(expectedHash);
}

// Main
const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-hash.js <password>');
  console.error('');
  console.error('Example:');
  console.error('  node generate-hash.js MySecurePassword123!');
  process.exit(1);
}

console.log('\n🔐 Password Hash Generator\n');
console.log('Password:', '*'.repeat(password.length));
console.log('');

const hash = generateHash(password);
console.log('Generated Hash:');
console.log(hash);
console.log('');

// Verify
console.log('Verification test:', verifyHash(password, hash) ? '✅ PASS' : '❌ FAIL');
console.log('');
console.log('Set this in Cloudflare Dashboard as AUTH_PASSWORD_HASH');
console.log('');

// Also generate a JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('Suggested JWT_SECRET:');
console.log(jwtSecret);
console.log('');