/**
 * 🔐 Simple Access Control - Упрощенная система контроля доступа БЕЗ Firebase
 * 
 * Функции:
 * - Проверка доступа через localStorage
 * - Валидация email и платежа
 * - Перенаправление на checkout при отсутствии доступа
 * - Работает полностью оффлайн
 */

class SimpleAccessControl {
  constructor() {
    this.isInitialized = true;
  }

  // Проверить доступ к симулятору
  async checkSimulatorAccess(simulator, userEmail = null) {
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

    // Проверяем реальные данные платежа
    const paymentData = localStorage.getItem('paymentData');
    if (!paymentData) {
      console.log('❌ No payment data found');
      return {
        hasAccess: false,
        reason: 'No payment data found',
        redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
      };
    }

    try {
      const data = JSON.parse(paymentData);
      
      // Проверяем соответствие симулятора
      if (data.simulator !== simulator) {
        console.log('❌ Payment for different simulator:', data.simulator, 'expected:', simulator);
        return {
          hasAccess: false,
          reason: 'Payment for different simulator',
          redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
        };
      }

      // Проверяем email (если указан)
      if (userEmail && data.userEmail !== userEmail) {
        console.log('❌ Email mismatch:', data.userEmail, 'expected:', userEmail);
        return {
          hasAccess: false,
          reason: 'Email mismatch',
          redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
        };
      }

      // Проверяем статус
      if (data.status !== 'confirmed' && data.status !== 'completed') {
        console.log('❌ Payment not confirmed:', data.status);
        return {
          hasAccess: false,
          reason: 'Payment not confirmed',
          redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
        };
      }

      // Проверяем срок действия (30 дней)
      const createdAt = new Date(data.createdAt || data.timestamp);
      const expiresAt = new Date(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      if (expiresAt < new Date()) {
        console.log('❌ Access expired');
        return {
          hasAccess: false,
          reason: 'Access expired',
          redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
        };
      }

      console.log('✅ Access granted to:', simulator, 'until:', expiresAt.toLocaleDateString());
      return {
        hasAccess: true,
        paymentId: data.id || data.paymentId,
        expiresAt: expiresAt,
        simulator: data.simulator,
        userEmail: data.userEmail
      };
    } catch (error) {
      console.error('❌ Error checking access:', error);
      return {
        hasAccess: false,
        reason: 'Error checking access',
        redirectTo: '/checkout.html?role=' + this.getSimulatorKey(simulator)
      };
    }
  }

  // Получить ключ симулятора для URL
  getSimulatorKey(simulator) {
    const keys = {
      'ux-designer': 'ux-designer',
      'lawyer': 'lawyer',
      'copywriter': 'copywriter',
      'psychologist': 'psychologist',
      'brand-marketer': 'brand-marketer',
      'qa-engineer': 'qa-engineer'
    };
    return keys[simulator] || simulator;
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
            <button onclick="window.location.href='/';" class="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors">
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
    
    // Автоматически перенаправляем через 5 секунд
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 5000);
  }

  // Получить сообщение об отказе в доступе
  getAccessDeniedMessage(reason) {
    switch (reason) {
      case 'No payment data found':
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
}

// Создаем глобальный экземпляр
window.SimpleAccessControl = SimpleAccessControl;

// Автоматическая защита симуляторов
document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем, находимся ли мы на странице симулятора
  const currentPath = window.location.pathname;
  const simulatorPages = [
    '/ux-sim-simple.html', 
    '/lawyer-simulator.html', 
    '/copywriter-simulator.html', 
    '/psychologist-simulator.html', 
    '/brand-marketer-simulator.html',
    '/qa-engineer-simulator.html',
    '/ux-sim.html'
  ];
  
  if (simulatorPages.includes(currentPath) || simulatorPages.some(page => currentPath.includes(page))) {
    const accessControl = new SimpleAccessControl();
    
    // Определяем симулятор по URL
    let simulator = 'ux-designer';
    if (currentPath.includes('lawyer')) {
      simulator = 'lawyer';
    } else if (currentPath.includes('copywriter')) {
      simulator = 'copywriter';
    } else if (currentPath.includes('psychologist')) {
      simulator = 'psychologist';
    } else if (currentPath.includes('brand-marketer')) {
      simulator = 'brand-marketer';
    } else if (currentPath.includes('qa-engineer')) {
      simulator = 'qa-engineer';
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
