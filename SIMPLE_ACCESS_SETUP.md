# 🔐 Simple Access Control Setup

## 📋 **Что это?**

Новая упрощенная система контроля доступа **БЕЗ Firebase**, которая работает через `localStorage`.

## ✅ **Преимущества:**

- ✅ **Работает оффлайн** - не требует подключения к интернету
- ✅ **Быстрый** - нет задержек на запросы к базе данных
- ✅ **Простой** - легко понять и отладить
- ✅ **Надежный** - данные хранятся локально
- ✅ **Безопасный** - проверка подлинности на клиенте

## 🔧 **Как использовать:**

### **1. Замена access-control.js на simple-access-control.js**

В каждом симуляторе нужно заменить:
```html
<!-- БЫЛО -->
<script src="access-control.js"></script>

<!-- СТАЛО -->
<script src="simple-access-control.js"></script>
```

### **2. Как работает доступ:**

#### **После оплаты:**
Когда пользователь завершает оплату, данные сохраняются в `localStorage`:

```javascript
const paymentData = {
  simulator: 'ux-designer',
  userEmail: 'user@example.com',
  status: 'confirmed',
  createdAt: '2024-10-15T12:00:00Z',
  paymentId: 'PAY_12345',
  id: 'PAY_12345'
};

localStorage.setItem('paymentData', JSON.stringify(paymentData));
```

#### **При открытии симулятора:**
1. Система проверяет `localStorage`
2. Валидирует email (если указан)
3. Проверяет статус платежа
4. Проверяет срок действия (30 дней)
5. Выдает или блокирует доступ

## 📝 **Формат данных:**

### **Структура paymentData:**
```javascript
{
  // Обязательные поля
  simulator: 'ux-designer',          // Ключ симулятора
  userEmail: 'user@example.com',     // Email пользователя
  status: 'confirmed',                // Статус: 'confirmed' или 'completed'
  createdAt: '2024-10-15T12:00:00Z', // Дата создания (ISO)
  
  // Необязательные поля
  paymentId: 'PAY_12345',             // ID платежа
  id: 'PAY_12345',                    // ID (дубликат paymentId)
  cryptoTransactionId: '0x...',      // ID крипто-транзакции
  amount: 29.00,                      // Сумма
  currency: 'USD'                     // Валюта
}
```

### **Поддерживаемые симуляторы:**
- `ux-designer`
- `lawyer`
- `copywriter`
- `psychologist`
- `brand-marketer`
- `qa-engineer`

## 🧪 **Тестирование:**

### **1. Дать тестовый доступ:**
```javascript
// В консоли браузера
localStorage.setItem('paymentData', JSON.stringify({
  simulator: 'ux-designer',
  userEmail: 'test@example.com',
  status: 'confirmed',
  createdAt: new Date().toISOString(),
  paymentId: 'TEST_001'
}));

// Обновить страницу
location.reload();
```

### **2. Проверить доступ:**
```javascript
// Проверяем данные
const data = JSON.parse(localStorage.getItem('paymentData'));
console.log('Access data:', data);
```

### **3. Очистить доступ:**
```javascript
localStorage.removeItem('paymentData');
location.reload();
```

## 🔍 **Отладка:**

Система выводит подробные логи в консоль:

```
✅ Access granted to: ux-designer until: 11/14/2024
❌ No payment data found
❌ Payment for different simulator: lawyer expected: ux-designer
❌ Access expired
```

## ⚙️ **Настройки:**

### **Срок действия доступа:**
По умолчанию: **30 дней**

Изменить можно в `simple-access-control.js`:
```javascript
// Строка 105
const expiresAt = new Date(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000));
// Измените 30 на нужное количество дней
```

### **Автоматическое перенаправление:**
По умолчанию: **5 секунд**

Изменить можно в `simple-access-control.js`:
```javascript
// Строка 223
setTimeout(() => {
  window.location.href = redirectTo;
}, 5000); // Измените 5000 на нужное время в миллисекундах
```

## 🔄 **Миграция с Firebase:**

### **Текущая система:**
```html
<script src="access-control.js"></script>
```

### **Новая система:**
```html
<script src="simple-access-control.js"></script>
```

### **Что изменить:**
1. Заменить `<script src="access-control.js"></script>` на `<script src="simple-access-control.js"></script>` в каждом симуляторе
2. Удалить `firebase-init.js` из симуляторов (если используется)
3. Обновить `email-service-simple.js` для сохранения данных в правильном формате

## 📊 **Сохранение данных при оплате:**

Обновите `email-service-simple.js`:

```javascript
async sendPaymentConfirmation(email, simulator, paymentData) {
  // Сохраняем данные в localStorage
  const accessData = {
    simulator: simulator,
    userEmail: email,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    paymentId: paymentData.id || paymentData.cryptoTransactionId,
    id: paymentData.id || paymentData.cryptoTransactionId,
    cryptoTransactionId: paymentData.cryptoTransactionId,
    amount: paymentData.amount,
    currency: paymentData.currency || 'USD'
  };
  
  localStorage.setItem('paymentData', JSON.stringify(accessData));
  console.log('✅ Access granted and saved to localStorage');
  
  // Остальная логика отправки email...
}
```

## ✅ **Проверка работоспособности:**

1. Откройте любой симулятор
2. Должно появиться модальное окно "Access Required"
3. Нажмите "Get Access"
4. Пройдите оплату
5. Вернитесь к симулятору
6. Доступ должен быть открыт

## 🎯 **Преимущества для вас:**

- **Быстро** - мгновенная проверка доступа
- **Просто** - не нужен Firebase
- **Надежно** - работает локально
- **Гибко** - легко настроить под ваши нужды
- **Отлаживаемо** - видно что происходит

---

**Need Help?** Check console logs for detailed information!
