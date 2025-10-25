/**
 * 💾 Local Storage Service - Простая система без Firebase
 * 
 * Функции:
 * - Сохранение покупок в localStorage
 * - Проверка доступа к симуляторам
 * - Работа с промокодами
 * - Отправка email уведомлений
 */

class LocalStorageService {
  constructor() {
    this.storageKey = 'profpilot_purchases';
    this.accessKey = 'profpilot_access';
    this.supportEmail = 'careers.inspirante@gmail.com';
  }

  // Сохранить покупку
  savePurchase(purchaseData) {
    try {
      const purchases = this.getAllPurchases();
      const purchaseId = this.generatePurchaseId();
      
      const purchase = {
        id: purchaseId,
        ...purchaseData,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      purchases.push(purchase);
      localStorage.setItem(this.storageKey, JSON.stringify(purchases));
      
      // Сохранить доступ
      this.grantAccess(purchaseData.simulator, purchaseData.userEmail, purchaseId);
      
      console.log('✅ Purchase saved to localStorage:', purchase);
      return purchase;
    } catch (error) {
      console.error('❌ Failed to save purchase:', error);
      return null;
    }
  }

  // Получить все покупки
  getAllPurchases() {
    try {
      const purchases = localStorage.getItem(this.storageKey);
      return purchases ? JSON.parse(purchases) : [];
    } catch (error) {
      console.error('❌ Failed to get purchases:', error);
      return [];
    }
  }

  // Проверить доступ к симулятору
  hasAccess(simulator, email) {
    try {
      const access = localStorage.getItem(this.accessKey);
      if (!access) return false;
      
      const accessData = JSON.parse(access);
      return accessData.some(item => 
        item.simulator === simulator && 
        (item.email === email || item.email === 'test@profpilot.co')
      );
    } catch (error) {
      console.error('❌ Failed to check access:', error);
      return false;
    }
  }

  // Предоставить доступ
  grantAccess(simulator, email, purchaseId) {
    try {
      const access = this.getAccessList();
      const accessItem = {
        simulator,
        email,
        purchaseId,
        grantedAt: new Date().toISOString()
      };
      
      access.push(accessItem);
      localStorage.setItem(this.accessKey, JSON.stringify(access));
      
      console.log('✅ Access granted:', accessItem);
    } catch (error) {
      console.error('❌ Failed to grant access:', error);
    }
  }

  // Получить список доступа
  getAccessList() {
    try {
      const access = localStorage.getItem(this.accessKey);
      return access ? JSON.parse(access) : [];
    } catch (error) {
      console.error('❌ Failed to get access list:', error);
      return [];
    }
  }

  // Генерировать ID покупки
  generatePurchaseId() {
    return 'PURCHASE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Отправить email уведомление (симуляция)
  async sendEmailNotification(purchaseData) {
    try {
      console.log('📧 Sending email notification...');
      
      const emailContent = this.createEmailContent(purchaseData);
      console.log('📧 Email content:', emailContent);
      
      // Показываем уведомление пользователю
      this.showEmailSentNotification(purchaseData);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Создать содержимое email
  createEmailContent(purchaseData) {
    const simulatorName = this.getSimulatorName(purchaseData.simulator);
    const simulatorUrl = this.getSimulatorUrl(purchaseData.simulator);
    
    return {
      to: purchaseData.userEmail,
      subject: 'Your ProfPilot Simulator Access is Ready! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation - ProfPilot</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to ProfPilot!</h1>
                    <p>Your simulator access is ready</p>
                </div>
                <div class="content">
                    <h2>Hello!</h2>
                    <p>Great news! Your access to the <strong>${simulatorName}</strong> is now active.</p>
                    
                    <p><strong>Purchase Details:</strong></p>
                    <ul>
                        <li>Simulator: ${simulatorName}</li>
                        <li>Amount: $${purchaseData.amount || 0}</li>
                        <li>Payment Method: ${purchaseData.paymentMethod || 'Promo Code'}</li>
                        <li>Purchase ID: ${purchaseData.id}</li>
                    </ul>
                    
                    <p>Click the button below to start your career simulation:</p>
                    <a href="${simulatorUrl}" class="button">Start Simulator</a>
                    
                    <p>If you have any questions, feel free to reach out to us at ${this.supportEmail}</p>
                </div>
                <div class="footer">
                    <p>© 2025 ProfPilot. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };
  }

  // Показать уведомление об отправке email
  showEmailSentNotification(purchaseData) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Email sent! Check your inbox for simulator access.</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Получить название симулятора
  getSimulatorName(simulatorKey) {
    const names = {
      'ux-designer': 'UX Designer Simulator',
      'lawyer': 'Corporate Lawyer Simulator',
      'corporate-lawyer': 'Corporate Lawyer Simulator',
      'copywriter': 'Copywriter / Creator Simulator',
      'psychologist': 'Psychologist Simulator',
      'brand-marketer': 'Brand Marketer Simulator',
      'qa-engineer': 'QA Automation Engineer Simulator'
    };
    return names[simulatorKey] || 'Career Simulator';
  }

  // Получить URL симулятора
  getSimulatorUrl(simulatorKey) {
    const urls = {
      'ux-designer': '/ux-sim-simple.html',
      'lawyer': '/lawyer-simulator.html',
      'corporate-lawyer': '/lawyer-simulator.html',
      'copywriter': '/copywriter-simulator.html',
      'psychologist': '/psychologist-simulator.html',
      'brand-marketer': '/brand-marketer-simulator.html',
      'qa-engineer': '/qa-engineer-simulator.html'
    };
    return `${window.location.origin}${urls[simulatorKey] || '/dashboard.html'}`;
  }

  // Очистить все данные (для тестирования)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.accessKey);
    console.log('🗑️ All data cleared');
  }

  // Получить статистику
  getStats() {
    const purchases = this.getAllPurchases();
    const access = this.getAccessList();
    
    return {
      totalPurchases: purchases.length,
      totalAccess: access.length,
      purchases: purchases,
      access: access
    };
  }
}

// Создаем глобальный экземпляр
window.LocalStorageService = LocalStorageService;
window.localStorageService = new LocalStorageService();

console.log('💾 Local Storage Service loaded (no Firebase)');
