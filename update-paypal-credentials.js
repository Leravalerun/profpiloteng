#!/usr/bin/env node

// Script to update PayPal production credentials
// Usage: node update-paypal-credentials.js YOUR_PRODUCTION_CLIENT_ID

const fs = require('fs');
const path = require('path');

// Get the production client ID from command line arguments
const productionClientId = process.argv[2];

if (!productionClientId) {
  console.error('❌ Error: Please provide your production client ID');
  console.log('Usage: node update-paypal-credentials.js YOUR_PRODUCTION_CLIENT_ID');
  console.log('Example: node update-paypal-credentials.js A123456789012345678901234567890123456789');
  process.exit(1);
}

// Validate the client ID format
if (!productionClientId.startsWith('A') || productionClientId.length < 50) {
  console.error('❌ Error: Invalid production client ID format');
  console.log('Production client ID should start with "A" and be at least 50 characters long');
  process.exit(1);
}

// Read the current paypal-config.js file
const configPath = path.join(__dirname, 'paypal-config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace the placeholder with the actual client ID
const updatedContent = configContent.replace(
  /clientId: 'YOUR_PRODUCTION_CLIENT_ID_HERE'/,
  `clientId: '${productionClientId}'`
);

// Write the updated content back to the file
fs.writeFileSync(configPath, updatedContent);

console.log('✅ PayPal production credentials updated successfully!');
console.log(`Client ID: ${productionClientId.substring(0, 10)}...`);
console.log('Environment: Production');
console.log('');
console.log('Next steps:');
console.log('1. Test the payment flow');
console.log('2. Commit and push changes');
console.log('3. Deploy to production');