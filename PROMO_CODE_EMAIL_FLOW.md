# 📧 Промокоды с обязательным сбором email

## 🎯 **Проблема:**
При использовании промокода система не собирала email пользователя, что не позволяло предоставить доступ к симулятору.

## ✅ **Решение:**
Теперь при применении промокода система **обязательно** собирает email перед предоставлением доступа.

## 🔄 **Новый поток для промокодов:**

### 1. **Пользователь вводит промокод**
- Вводит код (например, `checkppff`)
- Нажимает "Apply"

### 2. **Система проверяет промокод**
- Если промокод валидный и дает 100% скидку
- Показывает форму сбора email

### 3. **Сбор email**
- Форма: "📧 Get Free Access to Your Simulator"
- Описание: "Enter your email to receive free access to the simulator."
- Кнопка: "Get Free Access"

### 4. **Предоставление доступа**
- Создается запись в Firebase с email
- Показывается сообщение об успехе
- Предоставляется доступ к симулятору

## 🔧 **Технические изменения:**

### В `crypto-checkout-prod.html`:

#### 1. **Обновлена функция `showFreeAccess()`**
```javascript
function showFreeAccess() {
  // Check if email is collected
  if (!userEmail) {
    // Show email collection form for free access
    showEmailFormForFreeAccess();
  } else {
    // Email already collected, show free access
    document.getElementById('payment-details').classList.remove('show');
    document.getElementById('free-access').classList.add('show');
  }
}
```

#### 2. **Добавлена функция `showEmailFormForFreeAccess()`**
```javascript
function showEmailFormForFreeAccess() {
  // Hide crypto options and show email form
  document.getElementById('crypto-options').parentElement.classList.add('hidden');
  document.getElementById('email-collection').classList.remove('hidden');
  
  // Update the form title and description for free access
  document.querySelector('#email-collection h3').textContent = '📧 Get Free Access to Your Simulator';
  document.querySelector('#email-collection p').textContent = 'Enter your email to receive free access to the simulator.';
  
  // Update the button text
  const submitButton = document.querySelector('#email-form button');
  submitButton.textContent = 'Get Free Access';
}
```

#### 3. **Обновлен обработчик формы email**
```javascript
// Check if this is free access (promo code applied)
if (currentPromoCode && promoCodes[currentPromoCode] && promoCodes[currentPromoCode].discount === 100) {
  // Free access - show success message and redirect
  showFreeAccessSuccess();
} else {
  // Regular payment - show crypto options
  document.getElementById('email-collection').classList.add('hidden');
  document.getElementById('crypto-options').parentElement.classList.remove('hidden');
  
  // Create payment record
  createPaymentRecord();
}
```

#### 4. **Добавлена функция `showFreeAccessSuccess()`**
```javascript
async function showFreeAccessSuccess() {
  // Create payment record for free access
  await createPaymentRecord();
  
  // Hide email form and show free access success
  document.getElementById('email-collection').classList.add('hidden');
  document.getElementById('free-access').classList.add('show');
  
  console.log('✅ Free access granted with email:', userEmail);
}
```

#### 5. **Обновлена функция `createPaymentRecord()`**
```javascript
const paymentData = {
  userEmail: userEmail,
  simulator: simulator,
  amount: currentPrice,
  currency: 'USD',
  originalPrice: originalPrice,
  discount: originalPrice - currentPrice,
  promoCode: currentPromoCode,
  freeAccess: currentPrice === 0  // Новое поле
};
```

## 🎯 **Результат:**

### ✅ **Теперь система:**
- Собирает email при использовании промокода
- Создает запись в Firebase с email пользователя
- Предоставляет доступ к симулятору
- Отслеживает использование промокодов

### 🔄 **Пользовательский путь:**
1. Вводит промокод → 2. Вводит email → 3. Получает доступ

### 📊 **Данные в Firebase:**
```javascript
{
  userEmail: "user@example.com",
  simulator: "ux-designer",
  amount: 0,
  currency: "USD",
  originalPrice: 29.00,
  discount: 29.00,
  promoCode: "checkppff",
  freeAccess: true,
  status: "confirmed"
}
```

## 🚀 **Готово!**

Теперь система корректно обрабатывает промокоды с обязательным сбором email для предоставления доступа к симуляторам.
