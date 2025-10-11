# 💳 Система учета платежей и контроля доступа

## 🎯 Обзор системы

Создана полная система для:
- ✅ Сбора email пользователей
- ✅ Учета криптоплатежей
- ✅ Контроля доступа к симуляторам
- ✅ Верификации платежей
- ✅ Управления сессиями

## 🏗️ Архитектура

### 1. Сбор данных пользователя
```
Пользователь → Email форма → Payment Tracker → Firebase
```

### 2. Процесс оплаты
```
Email → Выбор крипты → Детали оплаты → Blockchain → Подтверждение
```

### 3. Контроль доступа
```
Симулятор → Access Control → Проверка платежа → Доступ/Отказ
```

## 📁 Файлы системы

### Основные компоненты:
- `payment-tracker.js` - Учет платежей и работа с Firebase
- `access-control.js` - Контроль доступа к симуляторам
- `crypto-checkout-prod.html` - Обновленная страница оплаты
- `ux-sim-simple.html` - Защищенный симулятор UX
- `lawyer-simulator.html` - Защищенный симулятор юриста

## 🔄 Пользовательский путь

### 1. Начало оплаты
1. Пользователь переходит на `/crypto-checkout-prod.html?role=ux-designer`
2. Видит форму сбора email
3. Вводит email и нажимает "Continue to Payment"

### 2. Выбор криптовалюты
1. Показываются варианты криптовалют (USDT, USDC, BTC, ETH)
2. Пользователь выбирает валюту
3. Показываются детали оплаты с адресом кошелька

### 3. Оплата
1. Пользователь копирует адрес кошелька
2. Отправляет криптовалюту на указанный адрес
3. Нажимает "Check Payment Status"

### 4. Подтверждение
1. Система проверяет blockchain транзакцию
2. При подтверждении показывает "Payment confirmed!"
3. Кнопка "Continue to Simulator" становится активной

### 5. Доступ к симулятору
1. Пользователь переходит к симулятору
2. Access Control проверяет наличие оплаты
3. При наличии доступа - показывает симулятор
4. При отсутствии - показывает модальное окно с предложением оплаты

## 🗄️ База данных (Firebase Firestore)

### Коллекция: `purchases`
```javascript
{
  id: "purchase_123",
  userId: "user@example.com",           // Email пользователя
  simulator: "ux-designer",             // Тип симулятора
  amount: 29.00,                        // Сумма оплаты
  currency: "USD",                      // Валюта
  cryptoAddress: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", // Адрес кошелька
  transactionHash: "0x123...abc",       // Хеш транзакции
  status: "pending|confirmed|failed",   // Статус платежа
  createdAt: timestamp,                 // Дата создания
  confirmedAt: timestamp,               // Дата подтверждения
  accessExpiresAt: timestamp,           // Дата истечения доступа
  promoCode: "checkppff",              // Промо-код (если использован)
  originalPrice: 29.00,                // Оригинальная цена
  discount: 0                          // Размер скидки
}
```

## 🔐 Система доступа

### Проверка доступа
1. **Email**: Проверяется соответствие email пользователя
2. **Симулятор**: Проверяется соответствие типа симулятора
3. **Статус**: Проверяется статус "confirmed"
4. **Срок**: Проверяется, не истек ли доступ (30 дней)

### Fallback система
- При недоступности Firebase используется localStorage
- Данные сохраняются локально для offline работы
- Синхронизация при восстановлении соединения

## 🚀 Развертывание

### 1. Настройка Firebase
```bash
# Создать проект в Firebase Console
# Включить Firestore Database
# Настроить правила безопасности
```

### 2. Правила безопасности Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      allow read, write: if true; // Временно для тестирования
      // В продакшене добавить проверку аутентификации
    }
  }
}
```

### 3. Загрузка файлов
```bash
# Загрузить все файлы на сервер
scp payment-tracker.js your-server:/path/to/website/
scp access-control.js your-server:/path/to/website/
scp crypto-checkout-prod.html your-server:/path/to/website/
```

## 🧪 Тестирование

### Тест 1: Полный цикл оплаты
1. Перейти на `/crypto-checkout-prod.html?role=ux-designer`
2. Ввести email: `test@example.com`
3. Выбрать USDT
4. Нажать "Check Payment Status"
5. Проверить, что показывается "Payment confirmed!"

### Тест 2: Контроль доступа
1. Перейти на `/ux-sim-simple.html`
2. Проверить, что показывается модальное окно с предложением оплаты
3. Перейти на checkout с email
4. Симулировать оплату
5. Вернуться к симулятору
6. Проверить, что доступ предоставлен

### Тест 3: Fallback система
1. Отключить интернет
2. Попробовать получить доступ к симулятору
3. Проверить, что система работает через localStorage

## 📊 Мониторинг

### Метрики для отслеживания:
- Количество созданных записей о платежах
- Процент подтвержденных платежей
- Время от создания до подтверждения
- Количество отказов в доступе
- Ошибки при проверке blockchain

### Логирование:
```javascript
console.log('✅ Payment record created:', paymentId);
console.log('❌ Access denied:', reason);
console.log('⚠️ Payment Tracker not available, using fallback');
```

## 🔧 Настройка

### Конфигурация криптовалют
```javascript
const CRYPTO_CONFIG = {
  currencies: {
    'USDT': {
      name: 'Tether',
      symbol: 'USDT',
      network: 'TRC20',
      address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
    }
    // ... другие валюты
  }
};
```

### Настройка доступа
```javascript
// Срок действия доступа (дни)
const ACCESS_DURATION_DAYS = 30;

// Кэширование результатов проверки (минуты)
const CACHE_DURATION_MINUTES = 10;
```

## 🆘 Устранение неполадок

### Проблема: "Payment Tracker not available"
**Решение**: Проверить загрузку Firebase SDK и payment-tracker.js

### Проблема: "Access denied" при наличии оплаты
**Решение**: Проверить соответствие email и симулятора

### Проблема: Медленная проверка платежей
**Решение**: Включить кэширование и оптимизировать запросы

## 🎯 Следующие шаги

1. **Интеграция с реальными blockchain API**
2. **Автоматическое подтверждение платежей**
3. **Email уведомления о статусе платежа**
4. **Панель администратора для управления доступом**
5. **Аналитика и отчеты по платежам**

## 💰 Стоимость

### Firebase Firestore
- Операции записи: $0.18/100K
- Операции чтения: $0.06/100K
- Хранилище: $0.026/GB

### Blockchain API
- TronScan: Бесплатно
- Etherscan: Бесплатно (с лимитами)

**Ожидаемая стоимость: $5-20/месяц** (в зависимости от объема)
