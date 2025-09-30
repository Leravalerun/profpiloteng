// PayPal Configuration
// This file contains PayPal settings for different environments

const PAYPAL_CONFIG = {
  // Development/Sandbox environment
  development: {
    clientId: 'ATqMLXIdVBcijAV9H8QmYud0idJcGQc-SHKYjhsvIPGSmvHv-Y988y60kljFD6uT6SXrnpkrLLWD4DvI',
    environment: 'sandbox',
    currency: 'USD',
    intent: 'capture'
  },
  
  // Production environment
  production: {
    clientId: 'YOUR_PRODUCTION_CLIENT_ID', // Replace with your actual production client ID
    environment: 'production',
    currency: 'USD',
    intent: 'capture'
  }
};

// Determine current environment
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1') &&
                    !window.location.hostname.includes('netlify.app');

// Export current configuration
const currentConfig = isProduction ? PAYPAL_CONFIG.production : PAYPAL_CONFIG.development;

// Make configuration available globally
window.PAYPAL_CONFIG = currentConfig;

// Simulator pricing
const SIMULATOR_PRICES = {
  'ux-designer': 29.00,
  'lawyer': 29.00
};

// Simulator descriptions
const SIMULATOR_DESCRIPTIONS = {
  'ux-designer': 'UX Designer Simulator - 3-day career test-drive',
  'lawyer': 'Corporate Lawyer Simulator - 3-day career test-drive'
};

// Make pricing available globally
window.SIMULATOR_PRICES = SIMULATOR_PRICES;
window.SIMULATOR_DESCRIPTIONS = SIMULATOR_DESCRIPTIONS;

console.log('🔧 PayPal Config loaded:', {
  environment: currentConfig.environment,
  isProduction: isProduction,
  clientId: currentConfig.clientId.substring(0, 10) + '...'
});

