# 🛤️ Путь клиента ProfPilot

## Полный пользовательский путь от главной страницы до симулятора

### 1. **Главная страница** 
```
URL: http://localhost:8080/
Действие: Клиент нажимает "Start for $29" или "Choose a profession"
```

### 2. **Выбор симулятора**
```
URL: http://localhost:8080/simulator-selection.html
Действие: Клиент выбирает между UX Designer и Corporate Lawyer
```

### 3. **Checkout страница**
```
URL: http://localhost:8080/checkout.html?role=ux-designer
Действие: 
- Клиент может ввести промо-код "checkppff" для бесплатного доступа
- Или нажать "Continue with Crypto" для оплаты
```

### 4. **Crypto оплата**
```
URL: http://localhost:8080/crypto-checkout-simple.html?role=ux-designer
Действие:
- Клиент выбирает криптовалюту (USDT, USDC, BTC, ETH)
- Копирует адрес кошелька
- Нажимает "Check Payment Status" (симуляция)
- Нажимает "Continue to Simulator"
```

### 5. **Симулятор**
```
URL: http://localhost:8080/ux-sim-simple.html
Действие: Клиент начинает 3-дневный симулятор
```

## 🎯 Альтернативные пути

### Путь с промо-кодом (бесплатный доступ):
```
1. Главная → 2. Выбор симулятора → 3. Checkout → 4. Ввод "checkppff" → 5. Симулятор
```

### Прямой доступ к симулятору:
```
URL: http://localhost:8080/ux-sim-simple.html
(для тестирования без оплаты)
```

## 🔧 Тестовые ссылки

### Для разработчиков:
- **Главная страница**: http://localhost:8080/
- **Выбор симулятора**: http://localhost:8080/simulator-selection.html
- **Checkout тест**: http://localhost:8080/test-checkout-fast.html
- **Crypto тест**: http://localhost:8080/crypto-test.html
- **UX симулятор**: http://localhost:8080/ux-sim-simple.html

### Промо-коды:
- **checkppff** - 100% скидка (бесплатный доступ)

## 📱 Мобильная версия

Все страницы адаптивны и работают на мобильных устройствах.

## 🚀 Production URLs

В продакшене замените `localhost:8080` на ваш домен:
- `https://profpilot.co/`
- `https://profpilot.co/simulator-selection.html`
- `https://profpilot.co/checkout.html?role=ux-designer`
- `https://profpilot.co/crypto-checkout-simple.html?role=ux-designer`
- `https://profpilot.co/ux-sim-simple.html`

## 🔍 Отладка

Если что-то не работает:
1. Откройте консоль браузера (F12)
2. Проверьте ошибки в Console
3. Убедитесь, что сервер запущен на порту 8080
4. Проверьте, что все файлы загружаются без ошибок

## 📊 Аналитика

Для отслеживания конверсии можно добавить события:
- `simulator_selected` - когда клиент выбирает симулятор
- `checkout_started` - когда клиент переходит на checkout
- `crypto_selected` - когда клиент выбирает криптовалюту
- `payment_completed` - когда клиент завершает оплату
- `simulator_started` - когда клиент начинает симулятор
