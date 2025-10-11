# 🔥 Firebase Setup Guide

## 🎯 Цель
Настроить Firebase для системы учета криптоплатежей и контроля доступа к симуляторам.

## 📋 Пошаговая инструкция

### Шаг 1: Создание проекта Firebase

1. **Перейти в Firebase Console**
   - Откройте [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Войдите в аккаунт Google

2. **Создать новый проект**
   - Нажмите "Create a project" или "Создать проект"
   - Название проекта: `profpilot-payments` (или любое другое)
   - Описание: `ProfPilot Payment Tracking System`

3. **Настроить Google Analytics (опционально)**
   - Можно включить для аналитики
   - Или отключить, если не нужен

4. **Дождаться создания проекта**
   - Процесс займет 1-2 минуты

### Шаг 2: Включение Firestore Database

1. **Перейти в Firestore**
   - В левом меню выберите "Firestore Database"
   - Нажмите "Create database"

2. **Выбрать режим безопасности**
   - Выберите "Start in test mode" (для начала)
   - Позже настроим правила безопасности

3. **Выбрать регион**
   - Рекомендуется: `us-central1` (США)
   - Или ближайший к вашим пользователям

4. **Дождаться создания базы данных**

### Шаг 3: Получение конфигурации

1. **Перейти в Project Settings**
   - Нажмите на шестеренку рядом с "Project Overview"
   - Выберите "Project settings"

2. **Перейти в раздел "Your apps"**
   - Прокрутите вниз до "Your apps"
   - Нажмите на иконку Web (</>)

3. **Зарегистрировать приложение**
   - Название: `ProfPilot Web App`
   - Опционально: включить Firebase Hosting
   - Нажмите "Register app"

4. **Скопировать конфигурацию**
   - Скопируйте объект `firebaseConfig`
   - Он понадобится для настройки

### Шаг 4: Настройка правил безопасности

1. **Перейти в Firestore Database**
   - Выберите "Rules" в верхнем меню

2. **Заменить правила на следующие:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Правила для коллекции purchases
       match /purchases/{purchaseId} {
         // Разрешить чтение и запись всем (временно для тестирования)
         allow read, write: if true;
         
         // В продакшене заменить на:
         // allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Опубликовать правила**
   - Нажмите "Publish"

### Шаг 5: Создание индексов (опционально)

1. **Перейти в раздел "Indexes"**
   - В Firestore Database выберите "Indexes"

2. **Создать составной индекс для запросов:**
   - Collection: `purchases`
   - Fields: `simulator` (Ascending), `status` (Ascending)
   - Fields: `userId` (Ascending), `status` (Ascending)

## 🔧 Конфигурационные файлы

### firebase-config.js
```javascript
// Конфигурация Firebase (замените на ваши данные)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Инициализация Firebase
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK not loaded');
} else {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
}
```

### firebase-init.js
```javascript
// Инициализация Firestore
if (typeof firebase !== 'undefined') {
  const db = firebase.firestore();
  
  // Настройки для разработки
  if (window.location.hostname === 'localhost') {
    db.settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
  }
  
  console.log('✅ Firestore initialized');
  window.firebaseDB = db;
} else {
  console.error('❌ Firebase not available');
}
```

## 🧪 Тестирование подключения

### Тест 1: Проверка подключения
```javascript
// Откройте консоль браузера и выполните:
console.log('Firebase:', typeof firebase !== 'undefined');
console.log('Firestore:', typeof firebase.firestore !== 'undefined');
```

### Тест 2: Создание тестовой записи
```javascript
// Создать тестовую запись в Firestore
const testData = {
  userId: 'test@example.com',
  simulator: 'ux-designer',
  amount: 29.00,
  status: 'test',
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
};

firebase.firestore().collection('purchases').add(testData)
  .then(doc => console.log('✅ Test record created:', doc.id))
  .catch(err => console.error('❌ Error:', err));
```

### Тест 3: Чтение данных
```javascript
// Прочитать все записи
firebase.firestore().collection('purchases').get()
  .then(snapshot => {
    console.log('📊 Records found:', snapshot.size);
    snapshot.forEach(doc => console.log(doc.data()));
  })
  .catch(err => console.error('❌ Error:', err));
```

## 🚀 Развертывание

### 1. Загрузить конфигурационные файлы
```bash
# Создать firebase-config.js с вашими данными
# Загрузить на сервер
scp firebase-config.js your-server:/path/to/website/
scp firebase-init.js your-server:/path/to/website/
```

### 2. Обновить HTML файлы
```html
<!-- Добавить в <head> -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-init.js"></script>
```

### 3. Проверить работу
- Открыть страницу оплаты
- Проверить консоль на ошибки
- Протестировать создание записи о платеже

## 🔒 Безопасность

### Для продакшена:
1. **Ограничить доступ по IP** (если возможно)
2. **Использовать аутентификацию** для записи данных
3. **Валидировать данные** на сервере
4. **Настроить мониторинг** подозрительной активности

### Правила безопасности для продакшена:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      // Разрешить чтение только авторизованным пользователям
      allow read: if request.auth != null;
      
      // Разрешить запись только с валидацией
      allow write: if request.auth != null 
        && resource.data.userId == request.auth.token.email
        && validatePurchaseData(request.resource.data);
    }
  }
  
  function validatePurchaseData(data) {
    return data.keys().hasAll(['userId', 'simulator', 'amount', 'status'])
      && data.userId is string
      && data.simulator in ['ux-designer', 'lawyer']
      && data.amount is number
      && data.status in ['pending', 'confirmed', 'failed'];
  }
}
```

## 📊 Мониторинг

### Firebase Console:
- **Usage** - отслеживание использования
- **Performance** - производительность запросов
- **Errors** - ошибки и исключения

### Рекомендуемые метрики:
- Количество операций чтения/записи
- Время ответа запросов
- Количество ошибок
- Размер базы данных

## 💰 Стоимость

### Firestore (бесплатный план):
- 50K операций чтения/день
- 20K операций записи/день
- 1GB хранилища
- 1GB трафика/день

### Ожидаемое использование:
- ~1000 операций/день при 100 пользователях
- ~100MB хранилища для 1000 записей
- **Стоимость: $0/месяц** (в пределах бесплатного плана)

## 🆘 Устранение неполадок

### Проблема: "Firebase not initialized"
**Решение**: Проверить загрузку SDK и конфигурацию

### Проблема: "Permission denied"
**Решение**: Проверить правила безопасности Firestore

### Проблема: "Network error"
**Решение**: Проверить настройки CORS и сетевые ограничения

## ✅ Чеклист

- [ ] Создан проект Firebase
- [ ] Включена Firestore Database
- [ ] Скопирована конфигурация
- [ ] Настроены правила безопасности
- [ ] Создан firebase-config.js
- [ ] Создан firebase-init.js
- [ ] Протестировано подключение
- [ ] Загружено на сервер
- [ ] Проверена работа системы

## 🎯 Результат

После настройки у вас будет:
- ✅ Рабочая база данных для платежей
- ✅ Система контроля доступа
- ✅ Отслеживание пользователей
- ✅ Готовность к масштабированию