# Firebase Analytics Dashboards Setup Guide

Это руководство по настройке дашбордов в Firebase Analytics для отслеживания ключевых метрик ProfPilot.

## 📊 Рекомендуемые Дашборды

### 1. Главный Dashboard (Overview)
**Назначение**: Общий обзор активности пользователей

**Метрики для отслеживания**:
- Активные пользователи (DAU/MAU)
- Сессии
- Просмотры страниц
- Время на сайте
- Конверсия в покупку

**Как создать**:
1. Firebase Console → Analytics → Dashboard
2. Создать новый Custom Dashboard
3. Добавить виджеты:
   - Active Users (Line Chart)
   - Page Views (Table)
   - Session Duration (Bar Chart)
   - Conversion Funnel (Funnel Chart)

---

### 2. Funnel Dashboard (Воронка конверсии)
**Назначение**: Отслеживание конверсии от визита до покупки

**События для воронки**:
1. `page_view` (homepage)
2. `checkout_started`
3. `payment_method_selected`
4. `payment_completed`
5. `simulator_started`

**Как создать**:
1. Firebase Console → Analytics → Events
2. Создать Custom Funnel
3. Добавить события в порядке:
   ```
   page_view (page_name = homepage)
   ↓
   checkout_started
   ↓
   payment_method_selected
   ↓
   payment_completed
   ↓
   simulator_started
   ```
4. Настроить условия для каждого шага

**Метрики**:
- Conversion Rate (общий)
- Drop-off Rate на каждом шаге
- Время на каждом шаге

---

### 3. Revenue Dashboard (Доходы)
**Назначение**: Отслеживание доходов и платежей

**События**:
- `purchase` (с параметром `value`)
- `payment_completed` (с параметром `amount`)
- `free_access_granted` (для промокодов)

**Параметры события**:
- `simulator` - какой симулятор
- `amount` / `value` - сумма платежа
- `payment_method` - метод оплаты (paypal, crypto, promo)
- `currency` - валюта

**Как создать**:
1. Firebase Console → Analytics → Events
2. Найти событие `purchase`
3. Создать Custom Report с группировкой:
   - По симулятору (`simulator`)
   - По методу оплаты (`payment_method`)
   - По дням/неделям/месяцам

**Метрики**:
- Total Revenue
- Revenue by Simulator
- Revenue by Payment Method
- Average Order Value (AOV)
- Revenue per User (ARPU)

---

### 4. Simulator Performance Dashboard
**Назначение**: Производительность симуляторов

**События**:
- `simulator_started`
- `day_started`
- `day_completed`
- `task_completed`
- `simulator_completed`

**Параметры**:
- `simulator` - тип симулятора
- `day` - номер дня
- `time_spent` - время на день/задачу
- `tasks_completed` - количество выполненных задач

**Как создать**:
1. Firebase Console → Analytics → Events
2. Создать Custom Report:
   - Events: `simulator_started`, `simulator_completed`
   - Group by: `simulator`
   - Metrics: Event Count, Unique Users

**Метрики**:
- Completion Rate (завершение симуляторов)
- Average Time per Day
- Task Completion Rate
- Drop-off Points (где пользователи уходят)

---

### 5. Error Tracking Dashboard
**Назначение**: Мониторинг ошибок и проблем

**События**:
- `error_occurred`
- `error_type` (параметр)
- `error_location` (параметр)

**Как создать**:
1. Firebase Console → Analytics → Events
2. Найти событие `error_occurred`
3. Создать Alert для критических ошибок:
   - Error Type = `payment_failed` → Alert immediately
   - Error Type = `auth_failed` → Alert if > 10/hour
   - Error Type = `resource_load_error` → Weekly summary

**Метрики**:
- Total Errors (по типам)
- Error Rate (ошибок на 1000 сессий)
- Top Error Locations (где чаще всего ошибки)
- Error Trends (рост/падение ошибок)

---

### 6. User Engagement Dashboard
**Назначение**: Вовлеченность пользователей

**События**:
- `session_start`
- `session_end`
- `page_view`
- `button_click`
- `time_on_page`

**Как создать**:
1. Firebase Console → Analytics → Engagement
2. Использовать встроенные метрики:
   - Average Session Duration
   - Pages per Session
   - Bounce Rate
   - Return Users

**Метрики**:
- Average Session Duration
- Pages per Session
- Active Users by Cohort
- User Retention (D1, D7, D30)

---

### 7. Promo Code Performance Dashboard
**Назначение**: Эффективность промокодов

**События**:
- `promo_code_applied`
- `free_access_granted`

**Параметры**:
- `code` - промокод
- `discount` - размер скидки
- `original_price` - оригинальная цена
- `final_price` - финальная цена

**Как создать**:
1. Firebase Console → Analytics → Events
2. Найти событие `promo_code_applied`
3. Создать Custom Report:
   - Group by: `code`
   - Metrics: Event Count, Unique Users
   - Filters: `code` = конкретный промокод

**Метрики**:
- Usage Count per Code
- Conversion Rate (применение → покупка)
- Revenue Impact (потерянные/полученные доходы)

---

## 🔧 Настройка Custom Events в Firebase

### Важные параметры событий

1. **Purchase Event**:
   ```
   Event: purchase
   Parameters:
   - value (number) - сумма платежа
   - currency (string) - валюта (USD)
   - simulator (string) - симулятор
   - payment_method (string) - метод оплаты
   ```

2. **Simulator Events**:
   ```
   Event: simulator_started
   Parameters:
   - simulator (string) - тип симулятора
   - user_id (string) - ID пользователя
   
   Event: day_completed
   Parameters:
   - simulator (string)
   - day (number)
   - time_spent (number) - секунды
   - tasks_completed (number)
   ```

3. **Error Events**:
   ```
   Event: error_occurred
   Parameters:
   - error_type (string)
   - error_message (string)
   - error_location (string)
   - severity (string) - high/medium/low
   ```

---

## 📈 Автоматические Alert'ы

### Настройка Alert'ов в Firebase:

1. **Критические ошибки**:
   - Error Type = `payment_failed` → Alert immediately
   - Error Rate > 5% → Alert

2. **Доходы**:
   - Revenue drop > 20% day-over-day → Alert
   - Zero purchases > 6 hours → Alert

3. **Воронка**:
   - Checkout drop-off > 50% → Alert
   - Payment completion rate < 30% → Alert

**Как настроить**:
1. Firebase Console → Analytics → Custom Alerts
2. Create Alert → Set conditions → Choose notification method

---

## 🎯 Ключевые метрики (KPIs)

### Ежедневные метрики:
- **DAU** (Daily Active Users)
- **Revenue** (день)
- **Conversion Rate** (visitor → purchase)
- **Error Rate**

### Недельные метрики:
- **MAU** (Monthly Active Users)
- **ARPU** (Average Revenue Per User)
- **Completion Rate** (симуляторов)
- **Retention Rate** (D7)

### Месячные метрики:
- **Total Revenue**
- **Customer Acquisition Cost (CAC)**
- **LTV** (Lifetime Value)
- **Churn Rate**

---

## 📱 Mobile App Dashboard (если будет мобильное приложение)

Если в будущем будет создано мобильное приложение:

1. **Mobile Events Dashboard**:
   - App Opens
   - Screen Views
   - In-App Purchases
   - Push Notification Opens

2. **Mobile Performance**:
   - Crash-Free Rate
   - App Load Time
   - API Response Time

---

## 🔗 Полезные ссылки

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Custom Events Guide](https://firebase.google.com/docs/analytics/events)
- [Dashboard Creation Guide](https://firebase.google.com/docs/analytics/dashboards)

---

## ✅ Checklist настройки

- [ ] Создан Overview Dashboard
- [ ] Настроена Funnel для checkout
- [ ] Настроен Revenue Dashboard
- [ ] Настроен Simulator Performance Dashboard
- [ ] Настроен Error Tracking Dashboard
- [ ] Настроены Alert'ы для критических ошибок
- [ ] Настроены Alert'ы для падения конверсии
- [ ] Настроен Promo Code Dashboard
- [ ] Настроен Engagement Dashboard
- [ ] Все ключевые события отслеживаются корректно

---

## 📝 Примечания

1. **Data Retention**: Firebase Analytics хранит данные бесплатно до 14 месяцев. Для более длительного хранения используйте BigQuery Export.

2. **BigQuery Export**: Рекомендуется настроить экспорт в BigQuery для глубокого анализа:
   - Firebase Console → Analytics → Settings → BigQuery Linking
   - Включить BigQuery Export

3. **Privacy**: Убедитесь, что все события соответствуют GDPR и другим требованиям конфиденциальности.

4. **Testing**: Всегда тестируйте события в DebugView перед релизом:
   - Firebase Console → Analytics → DebugView
   - Используйте `analytics_debug_mode` в URL для тестирования

---

**Последнее обновление**: 2024-12-15



