# PayPal Setup Instructions

## Получение PayPal Production Credentials

### 1. Войти в PayPal Developer Dashboard
- Перейдите на https://developer.paypal.com/
- Войдите в свой PayPal аккаунт

### 2. Создать новое приложение
- Нажмите "Create App"
- Выберите "Default Application" 
- Название: "ProfPilot"
- Merchant: выберите свой аккаунт

### 3. Настроить приложение
- **Environment**: Production
- **Features**: 
  - ✅ Accept payments
  - ✅ Future payments
  - ✅ Reference transactions
- **Webhook URL**: `https://www.profpilot.co/webhook` (опционально)

### 4. Получить Credentials
После создания приложения вы получите:
- **Client ID** (начинается с `A` и длинный)
- **Client Secret** (для бэкенда)

### 5. Обновить конфигурацию
Замените в файле `paypal-config.js`:

```javascript
production: {
  clientId: 'YOUR_ACTUAL_PRODUCTION_CLIENT_ID_HERE',
  environment: 'production',
  currency: 'USD',
  intent: 'capture'
}
```

### 6. Тестирование
- Сначала протестируйте в sandbox режиме
- Убедитесь, что платежи проходят
- Затем переключитесь на production

## Важные моменты

### Безопасность
- ❌ НЕ коммитьте Client Secret в Git
- ✅ Используйте переменные окружения для секретов
- ✅ Client ID можно публиковать (он в коде)

### Проверка
- Production Client ID начинается с `A`
- Sandbox Client ID начинается с `AT`
- Убедитесь, что используете правильный environment

### Поддержка
- PayPal Support: https://www.paypal.com/support
- Developer Documentation: https://developer.paypal.com/docs/
