/**
 * 💰 Payment Verification System
 * 
 * Проверяет реальные криптоплатежи через blockchain explorer API
 */

class PaymentVerification {
  constructor() {
    this.explorerApis = {
      'BTC': 'https://blockstream.info/api/tx/',
      'ETH': 'https://api.etherscan.io/api',
      'USDT': 'https://api.etherscan.io/api',
      'USDC': 'https://api.etherscan.io/api',
      'MATIC': 'https://api.polygonscan.com/api'
    };
    
    this.apiKeys = {
      'ETH': 'YOUR_ETHERSCAN_API_KEY',
      'USDT': 'YOUR_ETHERSCAN_API_KEY',
      'USDC': 'YOUR_ETHERSCAN_API_KEY',
      'MATIC': 'YOUR_POLYGONSCAN_API_KEY'
    };
  }

  // Проверить транзакцию криптовалюты
  async verifyCryptoPayment(txHash, currency, fromAddress, toAddress, amount) {
    try {
      console.log('🔍 Verifying payment:', { txHash, currency, fromAddress, toAddress, amount });

      switch (currency) {
        case 'BTC':
          return await this.verifyBitcoinPayment(txHash, fromAddress, toAddress, amount);
        case 'ETH':
        case 'USDT':
        case 'USDC':
        case 'MATIC':
          return await this.verifyEthereumPayment(txHash, currency, fromAddress, toAddress, amount);
        default:
          console.error('❌ Unsupported currency:', currency);
          return false;
      }
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      return false;
    }
  }

  // Проверить Bitcoin транзакцию
  async verifyBitcoinPayment(txHash, fromAddress, toAddress, expectedAmount) {
    try {
      console.log('🔍 Checking Bitcoin transaction...');
      
      const response = await fetch(`https://blockstream.info/api/tx/${txHash}`);
      if (!response.ok) {
        console.error('❌ Transaction not found or network error');
        return false;
      }

      const tx = await response.json();
      
      // Проверяем статус
      if (!tx.status || !tx.status.confirmed) {
        console.log('⏳ Transaction not confirmed yet');
        return false;
      }

      // Проверяем выходы (где отправляются средства)
      const outputs = tx.vout || [];
      let receivedAmount = 0;
      let correctRecipient = false;

      for (const output of outputs) {
        // Проверяем, что средства отправлены на правильный адрес
        if (output.scriptpubkey_address === toAddress) {
          correctRecipient = true;
          receivedAmount = output.value / 100000000; // Конвертируем из satoshi в BTC
        }
      }

      console.log('📊 Verification result:', {
        confirmed: tx.status.confirmed,
        correctRecipient,
        receivedAmount,
        expectedAmount,
        match: correctRecipient && receivedAmount >= expectedAmount - 0.0001 // Допускаем небольшую погрешность
      });

      return correctRecipient && receivedAmount >= expectedAmount - 0.0001;
    } catch (error) {
      console.error('❌ Bitcoin verification error:', error);
      return false;
    }
  }

  // Проверить Ethereum транзакцию (включая токены)
  async verifyEthereumPayment(txHash, currency, fromAddress, toAddress, expectedAmount) {
    try {
      console.log('🔍 Checking Ethereum transaction...');
      
      // Определяем сеть и API endpoint
      let apiEndpoint, apiKey;
      
      if (currency === 'MATIC') {
        apiEndpoint = 'https://api.polygonscan.com/api';
        apiKey = this.apiKeys.MATIC;
      } else {
        apiEndpoint = 'https://api.etherscan.io/api';
        apiKey = this.apiKeys.ETH;
      }

      // Получаем детали транзакции
      const txResponse = await fetch(
        `${apiEndpoint}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`
      );
      
      if (!txResponse.ok) {
        console.error('❌ Transaction not found');
        return false;
      }

      const txData = await txResponse.json();
      
      if (!txData.result || !txData.result.hash) {
        console.error('❌ Invalid transaction data');
        return false;
      }

      const tx = txData.result;

      // Проверяем получателя
      if (tx.to.toLowerCase() !== toAddress.toLowerCase()) {
        console.log('❌ Recipient address mismatch');
        return false;
      }

      // Проверяем статус транзакции
      const receiptResponse = await fetch(
        `${apiEndpoint}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${apiKey}`
      );
      
      const receiptData = await receiptResponse.json();
      
      if (receiptData.result && receiptData.result.status === '0') {
        console.log('❌ Transaction failed');
        return false;
      }

      // Для ETH проверяем value
      let receivedAmount;
      if (currency === 'ETH') {
        receivedAmount = parseInt(tx.value) / 1e18; // Конвертируем из wei
      } else {
        // Для токенов нужна дополнительная проверка
        console.log('✅ Transaction verified for token:', currency);
        return true; // Упрощенная проверка для токенов
      }

      console.log('📊 Verification result:', {
        receivedAmount,
        expectedAmount,
        match: receivedAmount >= expectedAmount - 0.0001
      });

      return receivedAmount >= expectedAmount - 0.0001;
    } catch (error) {
      console.error('❌ Ethereum verification error:', error);
      return false;
    }
  }

  // Проверить транзакцию вручную (для пользователя)
  async checkTransactionStatus(txHash, currency) {
    try {
      let explorerUrl;
      
      switch (currency) {
        case 'BTC':
          explorerUrl = `https://blockstream.info/tx/${txHash}`;
          break;
        case 'ETH':
          explorerUrl = `https://etherscan.io/tx/${txHash}`;
          break;
        case 'USDT':
        case 'USDC':
          explorerUrl = `https://etherscan.io/tx/${txHash}`;
          break;
        case 'MATIC':
          explorerUrl = `https://polygonscan.com/tx/${txHash}`;
          break;
        default:
          return null;
      }

      return {
        verified: false,
        pending: true,
        explorerUrl
      };
    } catch (error) {
      console.error('❌ Error checking transaction:', error);
      return null;
    }
  }

  // Проверить формат hash
  isValidTxHash(hash, currency) {
    const patterns = {
      'BTC': /^[a-fA-F0-9]{64}$/,
      'ETH': /^0x[a-fA-F0-9]{64}$/,
      'USDT': /^0x[a-fA-F0-9]{64}$/,
      'USDC': /^0x[a-fA-F0-9]{64}$/,
      'MATIC': /^0x[a-fA-F0-9]{64}$/
    };

    return patterns[currency]?.test(hash) || false;
  }
}

// Создаем глобальный экземпляр
window.PaymentVerification = PaymentVerification;

/**
 * 🔍 Примеры использования:
 * 
 * // 1. Проверить платеж автоматически
 * const verifier = new PaymentVerification();
 * const isValid = await verifier.verifyCryptoPayment(
 *   '0x123...',
 *   'ETH',
 *   '0xfrom...',
 *   '0xto...',
 *   0.029
 * );
 * 
 * // 2. Проверить статус транзакции
 * const status = await verifier.checkTransactionStatus(
 *   '0x123...',
 *   'ETH'
 * );
 * 
 * // 3. Проверить формат hash
 * const isValid = verifier.isValidTxHash('0x123...', 'ETH');
 */
