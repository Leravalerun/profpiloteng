#!/usr/bin/env node

/**
 * PayPal Credentials Update Script
 * 
 * This script helps update PayPal credentials across all files
 * Usage: node update-paypal-credentials.js <client-id>
 */

const fs = require('fs');
const path = require('path');

// Get client ID from command line arguments
const clientId = process.argv[2];

if (!clientId) {
  console.error('❌ Error: Please provide PayPal Client ID');
  console.log('Usage: node update-paypal-credentials.js <client-id>');
  console.log('Example: node update-paypal-credentials.js A123456789012345678901234567890123456789');
  process.exit(1);
}

// Validate client ID format
if (!clientId.startsWith('A') || clientId.length < 20) {
  console.error('❌ Error: Invalid PayPal Client ID format');
  console.log('PayPal Client ID should start with "A" and be at least 20 characters long');
  process.exit(1);
}

console.log('🔧 Updating PayPal credentials...');
console.log(`Client ID: ${clientId.substring(0, 10)}...`);

// Files to update
const filesToUpdate = [
  {
    path: 'paypal-config.js',
    patterns: [
      {
        search: /clientId: 'YOUR_PRODUCTION_CLIENT_ID'/g,
        replace: `clientId: '${clientId}'`
      }
    ]
  },
  {
    path: 'paypal-checkout.html',
    patterns: [
      {
        search: /client-id=YOUR_PRODUCTION_CLIENT_ID/g,
        replace: `client-id=${clientId}`
      }
    ]
  }
];

// Update files
let updatedFiles = 0;
let totalReplacements = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file.path}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    file.patterns.forEach(pattern => {
      const matches = content.match(pattern.search);
      if (matches) {
        content = content.replace(pattern.search, pattern.replace);
        fileReplacements += matches.length;
        totalReplacements += matches.length;
      }
    });

    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${file.path} (${fileReplacements} replacements)`);
      updatedFiles++;
    } else {
      console.log(`ℹ️  No changes needed in ${file.path}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${file.path}:`, error.message);
  }
});

// Summary
console.log('\n📊 Summary:');
console.log(`Files updated: ${updatedFiles}`);
console.log(`Total replacements: ${totalReplacements}`);

if (updatedFiles > 0) {
  console.log('\n🎉 PayPal credentials updated successfully!');
  console.log('\nNext steps:');
  console.log('1. Test the integration in development');
  console.log('2. Deploy to production');
  console.log('3. Verify payments work correctly');
} else {
  console.log('\n⚠️  No files were updated. Please check the file paths and patterns.');
}

console.log('\n📚 For more information, see PAYPAL_SETUP.md');

