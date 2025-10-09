# EmailJS Fix Instructions

## 🚨 Проблема
Получаете ошибку: "Template: One or more dynamic variables are corrupted"

## 🔧 Решение

### 1. Проверьте шаблон в EmailJS Dashboard

1. Войдите в [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Перейдите в раздел **Email Templates**
3. Найдите шаблон `payment_confirmation`
4. Проверьте, что все переменные правильно написаны

### 2. Правильные переменные для шаблона

В шаблоне должны быть следующие переменные:

```html
<!-- Основные переменные -->
{{to_name}}          <!-- Имя получателя -->
{{to_email}}         <!-- Email получателя -->
{{simulator_name}}   <!-- Название симулятора -->
{{amount}}           <!-- Сумма -->
{{currency}}         <!-- Валюта -->
{{payment_method}}   <!-- Способ оплаты -->
{{purchase_id}}      <!-- ID транзакции -->
{{dashboard_url}}    <!-- Ссылка на дашборд -->
{{simulator_url}}    <!-- Ссылка на симулятор -->

<!-- Опциональные переменные -->
{{promo_code}}       <!-- Промо-код (если есть) -->
```

### 3. Пример правильного шаблона

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Confirmation</title>
</head>
<body>
    <h1>Hello {{to_name}},</h1>
    
    <p>Your payment for <strong>{{simulator_name}}</strong> has been confirmed.</p>
    
    <h3>Payment Details:</h3>
    <ul>
        <li>Amount: ${{amount}} {{currency}}</li>
        <li>Payment Method: {{payment_method}}</li>
        <li>Transaction ID: {{purchase_id}}</li>
    </ul>
    
    <p><a href="{{simulator_url}}">Start Your Simulator</a></p>
    
    <p>Best regards,<br>ProfPilot Team</p>
</body>
</html>
```

### 4. Обновите конфигурацию в коде

В файле `email-service.js` обновите:

```javascript
this.emailJSConfig = {
  serviceId: 'YOUR_ACTUAL_SERVICE_ID',     // Замените на реальный ID
  templateId: 'payment_confirmation',      // Имя вашего шаблона
  publicKey: 'YOUR_ACTUAL_PUBLIC_KEY'     // Замените на реальный ключ
};
```

### 5. Проверьте отправляемые данные

Убедитесь, что данные, отправляемые в EmailJS, соответствуют переменным в шаблоне:

```javascript
const emailData = {
  to_name: purchaseData.userName || 'Valued Customer',
  to_email: purchaseData.userEmail,
  simulator_name: this.getSimulatorName(purchaseData.simulator),
  amount: purchaseData.amount,
  currency: purchaseData.currency || 'USD',
  payment_method: purchaseData.paymentMethod,
  purchase_id: purchaseData.purchase_id,
  dashboard_url: `${window.location.origin}/dashboard.html`,
  simulator_url: this.getSimulatorUrl(purchaseData.simulator),
  promo_code: purchaseData.promoCode || null
};
```

## 🚀 Временное решение

Пока EmailJS не настроен, используйте простую версию email service:

1. В `checkout.html` замените:
   ```html
   <script src="email-service.js"></script>
   ```
   на:
   ```html
   <script src="email-service-simple.js"></script>
   ```

2. Простая версия будет показывать уведомления в браузере вместо отправки реальных писем.

## 📧 Тестирование

1. Откройте checkout страницу
2. Введите промо-код `checkppff`
3. Проверьте, что появляется уведомление об отправке письма
4. Проверьте консоль браузера на наличие ошибок

## 🔍 Отладка

Если проблемы продолжаются:

1. Откройте консоль браузера (F12)
2. Проверьте ошибки в разделе Console
3. Убедитесь, что все переменные в шаблоне EmailJS написаны правильно
4. Проверьте, что serviceId и publicKey правильные

## 📞 Поддержка

Если нужна помощь с настройкой EmailJS:
- Email: careers.inspirante@gmail.com
- Документация EmailJS: https://www.emailjs.com/docs/
