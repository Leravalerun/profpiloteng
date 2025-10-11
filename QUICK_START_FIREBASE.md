# ⚡ Быстрый старт с Firebase

## 🎯 Для продакшена (5 минут)

### 1. Создать Firebase проект
1. Перейти на [console.firebase.google.com](https://console.firebase.google.com/)
2. Создать проект `profpilot-payments`
3. Включить Firestore Database в тестовом режиме

### 2. Получить конфигурацию
1. Project Settings → Your apps → Web app
2. Скопировать `firebaseConfig` объект

### 3. Настроить конфигурацию
```bash
# Автоматически создать продакшен конфигурацию
node setup-firebase-config.js prod

# Отредактировать firebase-config.js
# Заменить placeholder значения на реальные данные из Firebase Console
```

### 4. Протестировать
```bash
# Запустить локальный сервер
python3 -m http.server 8080

# Открыть тестовую страницу
open http://localhost:8080/firebase-test.html
```

## 🔧 Что происходит

1. **firebase-config-prod.js** - содержит ваши реальные данные (НЕ коммитится в git)
2. **firebase-config.js** - текущая конфигурация (НЕ коммитится в git)
3. **setup-firebase-config.js** - скрипт для переключения между окружениями

## ✅ Проверка

После настройки должно работать:
- ✅ Firebase SDK loaded
- ✅ Firestore ready
- ✅ Test record created
- ✅ Records read successfully

## 🚀 Развертывание

```bash
# Закоммитить изменения
git add .
git commit -m "Add Firebase production setup"
git push origin main

# На сервере создать firebase-config.js с реальными данными
```

## 🆘 Если что-то не работает

1. Проверить консоль браузера на ошибки
2. Убедиться, что firebase-config.js содержит реальные данные
3. Проверить правила безопасности Firestore
4. Обратиться к документации Firebase
