# 🔥 СРОЧНО: Исправление правил Firestore

## 🚨 **Проблема:**
```
❌ Connection test failed: Missing or insufficient permissions.
Error code: permission-denied
```

## 🎯 **Причина:**
Правила Firestore не обновились или есть синтаксическая ошибка.

## 🔧 **СРОЧНОЕ РЕШЕНИЕ:**

### Шаг 1: Перейти в Firebase Console
1. Открыть [console.firebase.google.com](https://console.firebase.google.com/)
2. Выбрать проект **profpiloteng**
3. Перейти в **Firestore Database**

### Шаг 2: Проверить правила
1. Нажать на вкладку **"Rules"**
2. Убедиться, что правила выглядят ТОЧНО так:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      allow read, write: if true;
    }
  }
}
```

### Шаг 3: Опубликовать правила
1. Нажать кнопку **"Publish"**
2. Дождаться сообщения "Rules published successfully"

### Шаг 4: Проверить работу
1. Обновить страницу `http://localhost:8080/debug-firebase-connection.html`
2. Нажать "Test Connection"
3. Должно показать: ✅ Connection test successful

## 🚨 **Если не помогло:**

### Вариант 1: Временно разрешить все
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true;
  }
}
```

### Вариант 2: Проверить проект
1. Убедиться, что выбран правильный проект `profpiloteng`
2. Проверить, что Firestore включен
3. Попробовать пересоздать правила

## ✅ **Ожидаемый результат:**

После исправления:
- ✅ Connection test successful
- ✅ Write test successful
- ✅ Read test successful
- ✅ Нет ошибок permission-denied

## 🎯 **Готово!**

После обновления правил система должна работать без ошибок.
