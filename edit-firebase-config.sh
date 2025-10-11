#!/bin/bash

# 🔥 Firebase Configuration Editor
# Быстрое редактирование конфигурации Firebase

echo "🔧 Firebase Configuration Editor"
echo "================================"

# Проверяем, существует ли firebase-config.js
if [ ! -f "firebase-config.js" ]; then
    echo "❌ firebase-config.js not found"
    echo "Creating from template..."
    node setup-firebase-config.js prod
fi

echo "📝 Opening firebase-config.js for editing..."
echo ""
echo "⚠️  IMPORTANT: Replace these placeholder values with your real Firebase data:"
echo "   - apiKey: 'your-production-api-key'"
echo "   - authDomain: 'your-project.firebaseapp.com'"
echo "   - projectId: 'your-project-id'"
echo "   - storageBucket: 'your-project.appspot.com'"
echo "   - messagingSenderId: '123456789'"
echo "   - appId: 'your-app-id'"
echo ""
echo "Press Enter to continue..."
read

# Открываем файл для редактирования
if command -v code &> /dev/null; then
    code firebase-config.js
elif command -v nano &> /dev/null; then
    nano firebase-config.js
elif command -v vim &> /dev/null; then
    vim firebase-config.js
else
    echo "Please edit firebase-config.js manually with your preferred editor"
    echo "File location: $(pwd)/firebase-config.js"
fi

echo ""
echo "✅ Configuration updated!"
echo "🧪 Test your configuration:"
echo "   1. python3 -m http.server 8080"
echo "   2. open http://localhost:8080/firebase-test.html"
