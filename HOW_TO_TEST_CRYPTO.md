# 🧪 Как протестировать крипто-оплату без реальных платежей

## 🚀 **Быстрый способ:**

### 1. **Откройте тестовую страницу:**
```
http://localhost:8080/quick-crypto-test.html
```

### 2. **Заполните форму:**
- **Email:** `test@example.com` (или любой другой)
- **Simulator:** Выберите `UX Designer` или `Corporate Lawyer`
- **Cryptocurrency:** Выберите любую криптовалюту

### 3. **Нажмите "💰 Simulate Payment"**
- Система создаст фейковый платеж
- Покажет сообщение об успехе
- Предоставит доступ к симулятору

### 4. **Проверьте доступ:**
- Нажмите "🎯 Open Simulator"
- Убедитесь, что симулятор открывается без блокировки

## 🔧 **Что происходит внутри:**

1. **Генерируется фейковый платеж:**
   - `paymentId`: `test_1234567890`
   - `transactionHash`: `0x1234567890abcdef...`

2. **Создается запись в системе:**
   - Сохраняется в `PaymentTracker`
   - Записывается в Firebase
   - Помечается как `testMode: true`

3. **Предоставляется доступ:**
   - Тестовые данные сохраняются в `localStorage`
   - Система контроля доступа их распознает
   - Доступ к симулятору разблокируется

## 🎯 **Альтернативные способы:**

### **Полный тест:**
```
http://localhost:8080/test-crypto-payment.html
```
- Автоматическое тестирование всех этапов
- Подробные логи и статусы
- Пошаговое выполнение

### **Тест промокодов:**
```
http://localhost:8080/crypto-checkout-prod.html?role=ux-designer
```
- Введите промокод: `checkppff`
- Система попросит email
- Предоставит бесплатный доступ

## ✅ **Проверка результатов:**

### **В консоли браузера должно быть:**
```
✅ Payment recorded in PaymentTracker
✅ Payment confirmed in blockchain
✅ Access granted to simulator
✅ Payment data saved to Firebase
```

### **В Firebase должно появиться:**
```javascript
{
  userEmail: "test@example.com",
  simulator: "ux-designer",
  amount: 29.00,
  currency: "USD",
  cryptoCurrency: "USDT",
  paymentId: "test_1234567890",
  transactionHash: "0x1234567890abcdef...",
  status: "confirmed",
  accessGranted: true,
  timestamp: "2024-01-01T12:00:00.000Z",
  testMode: true
}
```

### **В localStorage должно быть:**
```javascript
{
  email: "test@example.com",
  simulator: "ux-designer",
  paymentId: "test_1234567890",
  accessGranted: true
}
```

## 🚨 **Если что-то не работает:**

1. **Проверьте консоль браузера** на ошибки
2. **Убедитесь, что Firebase подключен** (должна быть зеленая галочка)
3. **Очистите localStorage** и повторите тест
4. **Проверьте, что все скрипты загружены**

## 🎉 **Готово!**

Теперь вы можете тестировать крипто-оплату без реальных транзакций!
