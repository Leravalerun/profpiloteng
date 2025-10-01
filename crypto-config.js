// Crypto Payment Configuration for ProfPilot
// Supports multiple cryptocurrencies for Russian users

const CRYPTO_CONFIG = {
  // Supported cryptocurrencies
  currencies: {
    'USDT': {
      name: 'Tether (USDT)',
      symbol: 'USDT',
      network: 'TRC20', // Tron network (cheaper fees)
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      rate: 1.0 // 1 USDT = 1 USD
    },
    'USDC': {
      name: 'USD Coin (USDC)',
      symbol: 'USDC', 
      network: 'TRC20',
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      rate: 1.0
    },
    'BTC': {
      name: 'Bitcoin (BTC)',
      symbol: 'BTC',
      network: 'Bitcoin',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      rate: 0.0 // Will be fetched from API
    },
    'ETH': {
      name: 'Ethereum (ETH)',
      symbol: 'ETH',
      network: 'Ethereum',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      rate: 0.0
    }
  },
  
  // Payment addresses (replace with your actual addresses)
  addresses: {
    'USDT': 'TYourUSDTAddressHere123456789',
    'USDC': 'TYourUSDCAddressHere123456789', 
    'BTC': '1YourBTCAddressHere123456789',
    'ETH': '0xYourETHAddressHere123456789'
  },
  
  // API for exchange rates
  exchangeRateAPI: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd',
  
  // Payment confirmation settings
  confirmation: {
    requiredConfirmations: 1, // For TRC20 tokens
    timeoutMinutes: 30, // Payment timeout
    checkIntervalSeconds: 10 // How often to check for payment
  }
};

// Make config globally available
window.CRYPTO_CONFIG = CRYPTO_CONFIG;

console.log('🔗 Crypto payment config loaded for Russian users');
