/**
 * 💳 Payment Tracker - Система учета криптоплатежей
 * 
 * Функции:
 * - Создание записи о платеже
 * - Проверка статуса платежа
 * - Предоставление доступа к симулятору
 * - Отслеживание blockchain транзакций
 */

class PaymentTracker {
  constructor() {
    this.firebase = null;
    this.db = null;
    this.isInitialized = false;
  }

  // Инициализация Firebase
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Проверяем, загружен ли Firebase
      if (typeof firebase === 'undefined') {
        console.error('❌ Firebase not loaded');
        return false;
      }

      this.firebase = firebase;
      this.db = firebase.firestore();
      this.isInitialized = true;
      
      console.log('✅ Payment Tracker initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Payment Tracker:', error);
      return false;
    }
  }

  // Создать запись о платеже
  async createPaymentRecord(paymentData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const paymentRecord = {
      userId: paymentData.userEmail || 'anonymous',
      simulator: paymentData.simulator,
      amount: paymentData.amount,
      currency: paymentData.currency,
      cryptoAddress: paymentData.cryptoAddress,
      transactionHash: null, // Будет заполнено после получения транзакции
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedAt: null,
      accessExpiresAt: null,
      promoCode: paymentData.promoCode || null,
      originalPrice: paymentData.originalPrice || paymentData.amount,
      discount: paymentData.discount || 0
    };

    try {
      const docRef = await this.db.collection('purchases').add(paymentRecord);
      console.log('✅ Payment record created:', docRef.id);
      
      // Сохраняем ID для отслеживания
      localStorage.setItem('paymentId', docRef.id);
      
      return {
        success: true,
        paymentId: docRef.id,
        record: paymentRecord
      };
    } catch (error) {
      console.error('❌ Failed to create payment record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Проверить статус платежа
  async checkPaymentStatus(paymentId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const doc = await this.db.collection('purchases').doc(paymentId).get();
      
      if (!doc.exists) {
        return {
          success: false,
          error: 'Payment record not found'
        };
      }

      const data = doc.data();
      return {
        success: true,
        status: data.status,
        record: data
      };
    } catch (error) {
      console.error('❌ Failed to check payment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Подтвердить платеж (вызывается после проверки blockchain)
  async confirmPayment(paymentId, transactionHash) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const updateData = {
        status: 'confirmed',
        transactionHash: transactionHash,
        confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
        accessExpiresAt: this.calculateAccessExpiry()
      };

      await this.db.collection('purchases').doc(paymentId).update(updateData);
      
      console.log('✅ Payment confirmed:', paymentId);
      return {
        success: true,
        message: 'Payment confirmed successfully'
      };
    } catch (error) {
      console.error('❌ Failed to confirm payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Проверить доступ к симулятору
  async checkAccess(simulator, userId = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      let query = this.db.collection('purchases')
        .where('simulator', '==', simulator)
        .where('status', '==', 'confirmed');

      if (userId) {
        query = query.where('userId', '==', userId);
      }

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return {
          hasAccess: false,
          reason: 'No confirmed payment found'
        };
      }

      // Проверяем, не истек ли доступ
      const now = new Date();
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.accessExpiresAt && data.accessExpiresAt.toDate() > now) {
          return {
            hasAccess: true,
            paymentId: doc.id,
            expiresAt: data.accessExpiresAt.toDate()
          };
        }
      }

      return {
        hasAccess: false,
        reason: 'Access expired'
      };
    } catch (error) {
      console.error('❌ Failed to check access:', error);
      return {
        hasAccess: false,
        reason: 'Error checking access'
      };
    }
  }

  // Проверить blockchain транзакцию
  async verifyBlockchainTransaction(address, amount, currency) {
    try {
      let apiUrl = '';
      
      switch (currency) {
        case 'USDT':
        case 'USDC':
          // TronScan API для TRC20 токенов
          apiUrl = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=20`;
          break;
        case 'BTC':
          // Blockchain.info API для Bitcoin
          apiUrl = `https://blockchain.info/rawaddr/${address}?limit=20`;
          break;
        case 'ETH':
          // Etherscan API для Ethereum
          apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=YourApiKeyToken`;
          break;
        default:
          return {
            success: false,
            error: 'Unsupported currency'
          };
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      // Ищем транзакцию с нужной суммой
      const transaction = this.findMatchingTransaction(data, amount, currency);
      
      if (transaction) {
        return {
          success: true,
          transaction: transaction,
          confirmed: true
        };
      } else {
        return {
          success: true,
          transaction: null,
          confirmed: false
        };
      }
    } catch (error) {
      console.error('❌ Failed to verify blockchain transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Найти соответствующую транзакцию
  findMatchingTransaction(data, amount, currency) {
    // Это упрощенная версия - в реальности нужна более сложная логика
    // в зависимости от API и формата данных
    
    if (currency === 'USDT' || currency === 'USDC') {
      // TronScan API формат
      const transactions = data.data || [];
      return transactions.find(tx => 
        tx.value === (amount * 1000000).toString() && // USDT имеет 6 знаков после запятой
        tx.token_info?.symbol === currency
      );
    }
    
    // Добавить логику для других валют...
    return null;
  }

  // Вычислить дату истечения доступа
  calculateAccessExpiry() {
    const now = new Date();
    const expiry = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 дней
    return firebase.firestore.Timestamp.fromDate(expiry);
  }

  // Получить историю покупок пользователя
  async getUserPurchases(userId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const snapshot = await this.db.collection('purchases')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const purchases = [];
      snapshot.forEach(doc => {
        purchases.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        purchases: purchases
      };
    } catch (error) {
      console.error('❌ Failed to get user purchases:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Отправить уведомление о подтверждении платежа
  async sendPaymentConfirmation(paymentId) {
    try {
      const doc = await this.db.collection('purchases').doc(paymentId).get();
      const data = doc.data();

      // Используем существующий email service
      if (window.SimpleEmailService) {
        const emailService = new window.SimpleEmailService();
        await emailService.sendPaymentConfirmation({
          simulator: data.simulator,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: 'crypto',
          cryptoTransactionId: data.transactionHash,
          userEmail: data.userId,
          userName: 'Valued Customer'
        });
      }

      console.log('✅ Payment confirmation sent');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to send payment confirmation:', error);
      return { success: false, error: error.message };
    }
  }
}

// Создаем глобальный экземпляр
window.PaymentTracker = PaymentTracker;
