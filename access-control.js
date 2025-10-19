/**
 * 🔐 Access Control - Система контроля доступа к симуляторам
 * 
 * Функции:
 * - Проверка доступа к симулятору
 * - Валидация email и платежа
 * - Перенаправление на checkout при отсутствии доступа
 * - Управление сессиями доступа
 */

class AccessControl {
  constructor() {
    this.firebase = null;
    this.db = null;
    this.isInitialized = false;
    this.accessCache = new Map();
  }

  // Инициализация Firebase
  async initialize() {
    if (this.isInitialized) return;

    try {
      if (typeof firebase === 'undefined') {
        console.error('❌ Firebase not loaded');
        return false;
      }

      this.firebase = firebase;
      this.db = firebase.firestore();
      this.isInitialized = true;
      
      console.log('✅ Access Control initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Access Control:', error);
      return false;
    }
  }

  // Проверить доступ к симулятору
  async checkSimulatorAccess(simulator, userEmail = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Проверяем тестовые данные из localStorage
    const testPaymentData = localStorage.getItem('testPaymentData');
    if (testPaymentData) {
      try {
        const testData = JSON.parse(testPaymentData);
        if (testData.simulator === simulator && testData.accessGranted) {
          console.log('✅ Test access granted for:', simulator);
          return {
            hasAccess: true,
            source: 'test',
            email: testData.email,
            paymentId: testData.paymentId
          };
        }
      } catch (error) {
        console.error('❌ Error parsing test payment data:', error);
      }
    }

    // Сначала проверяем кэш
    const cacheKey = `${simulator}_${userEmail || 'anonymous'}`;
    if (this.accessCache.has(cacheKey)) {
      const cached = this.accessCache.get(cacheKey);
      if (cached.expires > Date.now()) {
        return cached.data;
      } else {
        this.accessCache.delete(cacheKey);
      }
    }

    try {
      // Проверяем localStorage для fallback
      const localAccess = this.checkLocalAccess(simulator, userEmail);
      if (localAccess.hasAccess) {
        return localAccess;
      }

      // Проверяем в базе данных
      let query = this.db.collection('purchases')
        .where('simulator', '==', simulator)
        .where('status', '==', 'confirmed');

      if (userEmail) {
        query = query.where('userId', '==', userEmail);
      }

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        const result = {
          hasAccess: false,
          reason: 'No confirmed payment found',
          redirectTo: '/checkout.html?role=' + simulator
        };
        
        // Кэшируем результат на 5 минут
        this.accessCache.set(cacheKey, {
          data: result,
          expires: Date.now() + 5 * 60 * 1000
        });
        
        return result;
      }

      // Проверяем, не истек ли доступ
      const now = new Date();
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.accessExpiresAt && data.accessExpiresAt.toDate() > now) {
          const result = {
            hasAccess: true,
            paymentId: doc.id,
            expiresAt: data.accessExpiresAt.toDate(),
            simulator: data.simulator,
            userEmail: data.userId
          };
          
          // Кэшируем результат на 10 минут
          this.accessCache.set(cacheKey, {
            data: result,
            expires: Date.now() + 10 * 60 * 1000
          });
          
          return result;
        }
      }

      const result = {
        hasAccess: false,
        reason: 'Access expired',
        redirectTo: '/checkout.html?role=' + simulator
      };
      
      this.accessCache.set(cacheKey, {
        data: result,
        expires: Date.now() + 5 * 60 * 1000
      });
      
      return result;
    } catch (error) {
      console.error('❌ Failed to check simulator access:', error);
      return {
        hasAccess: false,
        reason: 'Error checking access',
        redirectTo: '/checkout.html?role=' + simulator
      };
    }
  }

  // Проверить доступ в localStorage (fallback)
  checkLocalAccess(simulator, userEmail = null) {
    try {
      const paymentData = localStorage.getItem('paymentData');
      if (!paymentData) {
        return {
          hasAccess: false,
          reason: 'No payment data found'
        };
      }

      const data = JSON.parse(paymentData);
      
      // Проверяем соответствие симулятора
      if (data.simulator !== simulator) {
        return {
          hasAccess: false,
          reason: 'Payment for different simulator'
        };
      }

      // Проверяем email (если указан)
      if (userEmail && data.userEmail !== userEmail) {
        return {
          hasAccess: false,
          reason: 'Email mismatch'
        };
      }

      // Проверяем статус
      if (data.status !== 'confirmed') {
        return {
          hasAccess: false,
          reason: 'Payment not confirmed'
        };
      }

      // Проверяем срок действия (30 дней)
      const createdAt = new Date(data.createdAt);
      const expiresAt = new Date(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      if (expiresAt < new Date()) {
        return {
          hasAccess: false,
          reason: 'Access expired'
        };
      }

      return {
        hasAccess: true,
        paymentId: data.id,
        expiresAt: expiresAt,
        simulator: data.simulator,
        userEmail: data.userEmail
      };
    } catch (error) {
      console.error('❌ Error checking local access:', error);
      return {
        hasAccess: false,
        reason: 'Error checking local access'
      };
    }
  }

  // Защитить симулятор (middleware)
  async protectSimulator(simulator, userEmail = null) {
    const access = await this.checkSimulatorAccess(simulator, userEmail);
    
    if (!access.hasAccess) {
      console.log('❌ Access denied:', access.reason);
      
      // Показываем уведомление
      this.showAccessDeniedModal(access.reason, access.redirectTo);
      
      return false;
    }
    
    console.log('✅ Access granted to simulator:', simulator);
    return true;
  }

  // Показать модальное окно отказа в доступе
  showAccessDeniedModal(reason, redirectTo) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Access Required</h3>
          <p class="text-slate-600 mb-6">${this.getAccessDeniedMessage(reason)}</p>
          <div class="flex gap-3">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <a href="${redirectTo}" class="flex-1 bg-brand-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-700 transition-colors text-center">
              Get Access
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Автоматически закрываем через 10 секунд
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
  }

  // Получить сообщение об отказе в доступе
  getAccessDeniedMessage(reason) {
    switch (reason) {
      case 'No confirmed payment found':
        return 'You need to purchase access to this simulator first.';
      case 'Access expired':
        return 'Your access to this simulator has expired. Please purchase again.';
      case 'Payment not confirmed':
        return 'Your payment is still being processed. Please wait for confirmation.';
      case 'Email mismatch':
        return 'Please use the same email address you used for payment.';
      case 'Payment for different simulator':
        return 'This payment was for a different simulator.';
      default:
        return 'Access to this simulator is required.';
    }
  }

  // Получить информацию о пользователе из URL или localStorage
  getUserEmail() {
    // Проверяем URL параметры
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
      return emailFromUrl;
    }

    // Проверяем localStorage
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        return data.userEmail;
      } catch (error) {
        console.error('❌ Error parsing payment data:', error);
      }
    }

    return null;
  }

  // Очистить кэш доступа
  clearAccessCache() {
    this.accessCache.clear();
    console.log('✅ Access cache cleared');
  }

  // Получить статистику доступа
  getAccessStats() {
    return {
      cacheSize: this.accessCache.size,
      isInitialized: this.isInitialized
    };
  }
}

// Создаем глобальный экземпляр
window.AccessControl = AccessControl;

// Автоматическая защита симуляторов
document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем, находимся ли мы на странице симулятора
  const currentPath = window.location.pathname;
  const simulatorPages = ['/ux-sim-simple.html', '/lawyer-simulator.html', '/copywriter-simulator-simple.html', '/ux-sim.html'];
  
  if (simulatorPages.includes(currentPath)) {
    const accessControl = new window.AccessControl();
    await accessControl.initialize();
    
    // Определяем симулятор по URL
    let simulator = 'ux-designer';
    if (currentPath.includes('lawyer')) {
      simulator = 'lawyer';
    }
    
    // Получаем email пользователя
    const userEmail = accessControl.getUserEmail();
    
    // Проверяем доступ
    const hasAccess = await accessControl.protectSimulator(simulator, userEmail);
    
    if (hasAccess) {
      console.log('✅ Simulator access granted');
    }
  }
});
