# 🧪 Тестирование крипто-оплаты без реальных платежей

## 🎯 **Цель:**
Позволить разработчикам и тестировщикам проверить полный цикл крипто-оплаты без необходимости совершать реальные транзакции.

## 🚀 **Способы тестирования:**

### 1. **⚡ Быстрый тест (Quick Test)**
**Файл:** `quick-crypto-test.html`

**Как использовать:**
1. Откройте `http://localhost:8080/quick-crypto-test.html`
2. Введите тестовый email
3. Выберите симулятор и криптовалюту
4. Нажмите "💰 Simulate Payment"
5. Система создаст фейковый платеж и предоставит доступ

**Что происходит:**
- Создается фейковый `paymentId` и `transactionHash`
- Данные сохраняются в `PaymentTracker`
- Запись создается в Firebase
- Доступ предоставляется автоматически
- Тестовые данные сохраняются в `localStorage`

### 2. **🧪 Полный тест (Full Test)**
**Файл:** `test-crypto-payment.html`

**Как использовать:**
1. Откройте `http://localhost:8080/test-crypto-payment.html`
2. Нажмите "🚀 Start Full Test" для автоматического тестирования
3. Или используйте отдельные кнопки для каждого этапа

**Этапы тестирования:**
1. **Сбор данных** - email, симулятор, криптовалюта
2. **Симуляция выбора** - имитация выбора криптовалюты
3. **Симуляция платежа** - создание фейкового платежа
4. **Проверка доступа** - верификация предоставления доступа

### 3. **🔗 Прямое тестирование**
**Файл:** `crypto-checkout-prod.html`

**Как использовать:**
1. Откройте `http://localhost:8080/crypto-checkout-prod.html?role=ux-designer`
2. Введите email и выберите криптовалюту
3. **НЕ отправляйте реальный платеж**
4. Используйте тестовые страницы для симуляции

## 🔧 **Технические детали:**

### **Генерация тестовых данных:**
```javascript
const paymentId = `test_${Date.now()}`;
const transactionHash = `0x${Math.random().toString(16).substr(2, 40)}`;
```

### **Сохранение в PaymentTracker:**
```javascript
const tracker = new PaymentTracker();
tracker.recordPayment(paymentId, simulator, email, 29.00, 'USD', transactionHash);
tracker.confirmPayment(paymentId);
tracker.grantAccess(paymentId);
```

### **Сохранение в Firebase:**
```javascript
const paymentData = {
  userEmail: email,
  simulator: simulator,
  amount: 29.00,
  currency: 'USD',
  cryptoCurrency: crypto,
  paymentId: paymentId,
  transactionHash: transactionHash,
  status: 'confirmed',
  accessGranted: true,
  timestamp: new Date().toISOString(),
  testMode: true  // Флаг тестового режима
};
```

### **Проверка доступа в симуляторах:**
```javascript
// В access-control.js добавлена проверка тестовых данных
const testPaymentData = localStorage.getItem('testPaymentData');
if (testPaymentData) {
  const testData = JSON.parse(testPaymentData);
  if (testData.simulator === simulator && testData.accessGranted) {
    return { hasAccess: true, source: 'test' };
  }
}
```

## 📋 **Чек-лист тестирования:**

### ✅ **Базовое тестирование:**
- [ ] Открыть `quick-crypto-test.html`
- [ ] Ввести тестовый email
- [ ] Выбрать симулятор и криптовалюту
- [ ] Нажать "Simulate Payment"
- [ ] Проверить сообщение об успехе
- [ ] Открыть симулятор и проверить доступ

### ✅ **Полное тестирование:**
- [ ] Открыть `test-crypto-payment.html`
- [ ] Запустить "Start Full Test"
- [ ] Проверить все 4 этапа
- [ ] Проверить логи в консоли
- [ ] Проверить данные в Firebase

### ✅ **Тестирование промокодов:**
- [ ] Открыть `crypto-checkout-prod.html`
- [ ] Ввести промокод `checkppff`
- [ ] Проверить сбор email для бесплатного доступа
- [ ] Проверить предоставление доступа

### ✅ **Тестирование контроля доступа:**
- [ ] Открыть симулятор без тестовых данных
- [ ] Проверить перенаправление на checkout
- [ ] Создать тестовый платеж
- [ ] Проверить доступ к симулятору

## 🎯 **Ожидаемые результаты:**

### **При успешном тестировании:**
- ✅ Платеж создается в PaymentTracker
- ✅ Данные сохраняются в Firebase
- ✅ Доступ предоставляется к симулятору
- ✅ Контроль доступа работает корректно
- ✅ Промокоды требуют email

### **При ошибках:**
- ❌ Проверить консоль браузера
- ❌ Проверить подключение к Firebase
- ❌ Проверить загрузку скриптов
- ❌ Очистить localStorage и повторить

## 🚀 **Быстрый старт:**

1. **Запустите локальный сервер:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Откройте быстрый тест:**
   ```
   http://localhost:8080/quick-crypto-test.html
   ```

3. **Симулируйте платеж:**
   - Введите email: `test@example.com`
   - Выберите симулятор: `UX Designer`
   - Выберите криптовалюту: `USDT`
   - Нажмите "💰 Simulate Payment"

4. **Проверьте доступ:**
   - Нажмите "🎯 Open Simulator"
   - Убедитесь, что доступ предоставлен

## 🎉 **Готово!**

Теперь вы можете тестировать всю систему крипто-оплаты без реальных транзакций!
