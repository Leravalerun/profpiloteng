/**
 * 🔥 Firebase Configuration Example
 * 
 * Скопируйте этот файл в firebase-config.js и замените значения на ваши данные
 * Получить можно в Firebase Console > Project Settings > Your apps > Web app
 */

const firebaseConfig = {
  // ⚠️ ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Проверяем, что Firebase SDK загружен
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase SDK not loaded. Please include Firebase scripts first.');
} else {
  try {
    // Инициализируем Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    
    // Проверяем подключение к Firestore
    const db = firebase.firestore();
    console.log('✅ Firestore connection ready');
    
    // Делаем db доступным глобально
    window.firebaseDB = db;
    
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

// Экспортируем конфигурацию для использования в других скриптах
window.firebaseConfig = firebaseConfig;
