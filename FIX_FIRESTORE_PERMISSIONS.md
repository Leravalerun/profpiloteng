# 🔒 Исправление ошибки "Missing or insufficient permissions"

## 🚨 **Проблема:**
```
❌ Error: Missing or insufficient permissions.
```

## 🎯 **Причина:**
Правила безопасности Firestore не настроены или слишком строгие.

## 🔧 **Решение:**

### Шаг 1: Перейти в Firebase Console
1. Открыть [console.firebase.google.com](https://console.firebase.google.com/)
2. Выбрать проект `profpiloteng`
3. Перейти в **Firestore Database**

### Шаг 2: Настроить правила безопасности
1. Перейти на вкладку **"Rules"**
2. Заменить существующие правила на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      // Временно разрешить все для тестирования
      allow read, write: if true;
    }
  }
}
```

3. Нажать **"Publish"**

### Шаг 3: Проверить работу
1. Обновить страницу `http://localhost:8080/firebase-test.html`
2. Попробовать создать тестовую запись
3. Проверить, что ошибка исчезла

## 🔒 **Для продакшена (позже):**

После тестирования заменить правила на более строгие:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      // Разрешить чтение всем
      allow read: if true;
      
      // Разрешить запись только с валидацией
      allow write: if validatePurchaseData(request.resource.data);
    }
  }
  
  function validatePurchaseData(data) {
    return data.keys().hasAll(['userId', 'simulator', 'amount', 'status'])
      && data.userId is string
      && data.simulator in ['ux-designer', 'lawyer']
      && data.amount is number
      && data.status in ['pending', 'confirmed', 'failed']
      && data.amount >= 0
      && data.amount <= 1000;
  }
}
```

## ✅ **Проверка:**

После настройки правил:
- ✅ Firebase test page работает
- ✅ Можно создавать записи
- ✅ Можно читать данные
- ✅ Система платежей функционирует

## 🆘 **Если не помогло:**

1. **Проверить проект Firebase**
   - Убедиться, что выбран правильный проект
   - Проверить, что Firestore включен

2. **Проверить конфигурацию**
   - Убедиться, что `firebase-config.js` содержит правильные данные
   - Проверить, что все поля заполнены

3. **Проверить консоль браузера**
   - Открыть F12 → Console
   - Посмотреть на полный текст ошибки

## 🎯 **Готово!**

После настройки правил безопасности система должна работать без ошибок.
