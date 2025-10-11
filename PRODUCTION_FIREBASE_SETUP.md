# 🚀 Настройка Firebase для продакшена

## 🎯 Цель
Настроить Firebase с реальными данными для продакшена, не коммитя конфиденциальную информацию в git.

## 📋 Пошаговая инструкция

### Шаг 1: Создать продакшен конфигурацию

1. **Скопировать шаблон**
   ```bash
   cp firebase-config.example.js firebase-config-prod.js
   ```

2. **Отредактировать firebase-config-prod.js**
   - Заменить все placeholder значения на реальные данные из Firebase Console
   - Сохранить файл

### Шаг 2: Настроить окружение

#### Вариант A: Автоматически (рекомендуется)
```bash
# Для продакшена
node setup-firebase-config.js prod

# Для разработки
node setup-firebase-config.js dev
```

#### Вариант B: Вручную
```bash
# Для продакшена
cp firebase-config-prod.js firebase-config.js

# Для разработки
cp firebase-config.example.js firebase-config.js
```

### Шаг 3: Обновить .gitignore

Убедитесь, что в `.gitignore` есть:
```
# Firebase Configuration
firebase-config.js
firebase-config-local.js
firebase-config-prod.js
```

### Шаг 4: Протестировать

1. **Локально**
   ```bash
   # Запустить локальный сервер
   python3 -m http.server 8080
   
   # Открыть тестовую страницу
   open http://localhost:8080/firebase-test.html
   ```

2. **На продакшене**
   - Загрузить `firebase-config.js` на сервер
   - Проверить работу системы платежей

## 🔧 Структура файлов

```
project/
├── firebase-config.example.js    # Шаблон (коммитится в git)
├── firebase-config-prod.js       # Продакшен (НЕ коммитится)
├── firebase-config.js            # Текущая конфигурация (НЕ коммитится)
├── setup-firebase-config.js      # Скрипт настройки (коммитится)
└── .gitignore                    # Исключения для git
```

## 🚀 Развертывание

### На сервере

1. **Загрузить файлы**
   ```bash
   # Загрузить все файлы кроме firebase-config.js
   scp -r . user@server:/path/to/website/
   
   # Создать firebase-config.js на сервере
   ssh user@server
   cd /path/to/website/
   cp firebase-config.example.js firebase-config.js
   # Отредактировать firebase-config.js с реальными данными
   ```

2. **Проверить работу**
   - Открыть сайт
   - Проверить консоль браузера на ошибки
   - Протестировать систему платежей

### С помощью git

1. **Локально**
   ```bash
   # Настроить продакшен конфигурацию
   node setup-firebase-config.js prod
   
   # Отредактировать firebase-config.js
   # (заменить на реальные данные)
   
   # Закоммитить изменения (firebase-config.js не попадет в git)
   git add .
   git commit -m "Update for production"
   git push origin main
   ```

2. **На сервере**
   ```bash
   # Получить обновления
   git pull origin main
   
   # Настроить конфигурацию
   cp firebase-config.example.js firebase-config.js
   # Отредактировать firebase-config.js с реальными данными
   ```

## 🔒 Безопасность

### Что НЕ коммитится в git:
- ✅ `firebase-config.js` - текущая конфигурация
- ✅ `firebase-config-prod.js` - продакшен конфигурация
- ✅ `.env` файлы
- ✅ Ключи API
- ✅ Пароли и токены

### Что коммитится в git:
- ✅ `firebase-config.example.js` - шаблон
- ✅ `setup-firebase-config.js` - скрипт настройки
- ✅ `.gitignore` - исключения
- ✅ Документация

## 🧪 Тестирование

### Локальное тестирование
```bash
# 1. Настроить конфигурацию
node setup-firebase-config.js prod

# 2. Отредактировать firebase-config.js
# (заменить на реальные данные)

# 3. Запустить сервер
python3 -m http.server 8080

# 4. Открыть тестовую страницу
open http://localhost:8080/firebase-test.html

# 5. Проверить статус подключения
# 6. Создать тестовую запись
# 7. Проверить работу системы платежей
```

### Продакшен тестирование
1. Открыть сайт
2. Перейти на страницу оплаты
3. Проверить консоль браузера
4. Протестировать полный цикл оплаты

## 🆘 Устранение неполадок

### Проблема: "firebase-config.js not found"
**Решение**: Запустить `node setup-firebase-config.js prod`

### Проблема: "Firebase not initialized"
**Решение**: Проверить данные в firebase-config.js

### Проблема: "Permission denied"
**Решение**: Проверить правила безопасности Firestore

### Проблема: "Configuration committed to git"
**Решение**: Проверить .gitignore и удалить из git истории

## ✅ Чеклист

- [ ] Создан firebase-config-prod.js с реальными данными
- [ ] Настроен .gitignore
- [ ] Протестировано локально
- [ ] Загружено на сервер
- [ ] Протестировано на продакшене
- [ ] Проверена безопасность (нет секретов в git)

## 🎯 Результат

После настройки:
- ✅ Продакшен конфигурация готова
- ✅ Секреты не попадают в git
- ✅ Легко переключаться между окружениями
- ✅ Система платежей работает на продакшене
- ✅ Безопасность данных обеспечена
