# ⚡ Быстрая настройка Firebase (3 шага)

## 🎯 **Что нужно сделать:**

### 1. **Создать Firebase проект** (2 минуты)
1. Перейти на [console.firebase.google.com](https://console.firebase.google.com/)
2. Создать проект `profpilot-payments`
3. Включить Firestore Database в тестовом режиме

### 2. **Получить конфигурацию** (1 минута)
1. Project Settings → Your apps → Web app
2. Скопировать объект `firebaseConfig`

### 3. **Вставить данные** (1 минута)
```bash
# Автоматически создать файл
node setup-firebase-config.js prod

# Отредактировать файл
./edit-firebase-config.sh
```

## 🔧 **Что происходит:**

1. **`node setup-firebase-config.js prod`** - создает `firebase-config.js`
2. **`./edit-firebase-config.sh`** - открывает файл для редактирования
3. **Вставить реальные данные** - заменить placeholder значения
4. **Протестировать** - проверить работу

## 📍 **Куда вставлять данные:**

В файле `firebase-config.js` заменить:
```javascript
const firebaseConfig = {
  apiKey: "your-production-api-key",           // ← Вставить ваш API ключ
  authDomain: "your-project.firebaseapp.com", // ← Вставить ваш домен
  projectId: "your-project-id",               // ← Вставить ваш ID проекта
  storageBucket: "your-project.appspot.com",  // ← Вставить ваш bucket
  messagingSenderId: "123456789",             // ← Вставить ваш sender ID
  appId: "your-app-id"                        // ← Вставить ваш app ID
};
```

## ✅ **Проверка:**

```bash
# Запустить сервер
python3 -m http.server 8080

# Открыть тестовую страницу
open http://localhost:8080/firebase-test.html

# Проверить статус:
# ✅ Firebase SDK loaded
# ✅ Firestore ready
```

## 🚀 **Готово!**

После настройки:
- ✅ Система платежей работает с Firebase
- ✅ Данные сохраняются в базе данных
- ✅ Контроль доступа активен
- ✅ Можно тестировать полный цикл оплаты

## 🆘 **Если что-то не работает:**

1. Проверить консоль браузера на ошибки
2. Убедиться, что все данные вставлены правильно
3. Проверить правила безопасности Firestore
4. Обратиться к документации Firebase
