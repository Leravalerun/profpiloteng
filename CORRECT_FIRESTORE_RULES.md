# 🔥 ПРАВИЛЬНЫЕ правила Firestore

## 🚨 **ОШИБКА:**
```
Error saving rules – Line 1: mismatched input 'rurules_version' expecting {'function', 'import', 'service', 'rules_version'}
```

## 🎯 **ПРИЧИНА:**
Опечатка в начале файла правил - лишняя буква "ru" перед "rules_version"

## ✅ **ПРАВИЛЬНЫЕ ПРАВИЛА:**

### Вариант 1: Максимально простые
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Вариант 2: Только для коллекции purchases
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

## 🔧 **КАК ИСПРАВИТЬ:**

### Шаг 1: Перейти в Firebase Console
1. Открыть [console.firebase.google.com](https://console.firebase.google.com/)
2. Выбрать проект **profpiloteng**
3. Firestore Database → Rules

### Шаг 2: Удалить ВСЕ правила
1. **УДАЛИТЬ ВСЕ** существующие правила
2. Очистить поле полностью

### Шаг 3: Вставить правильные правила
1. Скопировать **Вариант 1** выше
2. Вставить в поле правил
3. **Проверить**, что нет опечаток

### Шаг 4: Опубликовать
1. Нажать **"Publish"**
2. Дождаться "Rules published successfully"

## ✅ **ПРОВЕРКА:**

После исправления:
- ✅ Правила сохраняются без ошибок
- ✅ Firebase тест проходит
- ✅ Система платежей работает
- ✅ Нет ошибок permission-denied

## 🎯 **ГОТОВО!**

После исправления опечатки система должна работать без ошибок.
