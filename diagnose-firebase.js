/**
 * 🔍 Firebase Connection Diagnostician
 * 
 * Автоматически диагностирует проблемы с подключением к Firebase
 * и предлагает решения
 */

console.log('🔍 Starting Firebase diagnostics...');

// Основная функция диагностики
async function diagnoseFirebase() {
  console.log('=====================================');
  console.log('🔍 FIREBASE CONNECTION DIAGNOSTICS');
  console.log('=====================================');
  
  const results = {
    firebaseSDK: false,
    firebaseConfig: false,
    firebaseApp: false,
    firestore: false,
    connection: false,
    rules: false
  };

  // 1. Проверка Firebase SDK
  console.log('1️⃣ Checking Firebase SDK...');
  if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase SDK loaded');
    results.firebaseSDK = true;
  } else {
    console.log('❌ Firebase SDK not loaded');
    console.log('🔧 SOLUTION: Add Firebase scripts to HTML');
    return results;
  }

  // 2. Проверка конфигурации
  console.log('2️⃣ Checking Firebase configuration...');
  if (typeof window.firebaseConfig !== 'undefined') {
    const config = window.firebaseConfig;
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field] || config[field].includes('your-') || config[field].includes('placeholder'));
    
    if (missingFields.length === 0) {
      console.log('✅ Firebase configuration looks good');
      results.firebaseConfig = true;
    } else {
      console.log('❌ Firebase configuration incomplete');
      console.log('Missing or invalid fields:', missingFields);
      console.log('🔧 SOLUTION: Update firebase-config.js with real data');
      return results;
    }
  } else {
    console.log('❌ Firebase configuration not found');
    console.log('🔧 SOLUTION: Check firebase-config.js file');
    return results;
  }

  // 3. Проверка инициализации Firebase
  console.log('3️⃣ Checking Firebase app initialization...');
  try {
    const app = firebase.app();
    console.log('✅ Firebase app initialized:', app.name);
    results.firebaseApp = true;
  } catch (error) {
    console.log('❌ Firebase app not initialized:', error.message);
    console.log('🔧 SOLUTION: Check firebase-config.js and initialization');
    return results;
  }

  // 4. Проверка Firestore
  console.log('4️⃣ Checking Firestore...');
  try {
    const db = firebase.firestore();
    console.log('✅ Firestore instance created');
    results.firestore = true;
  } catch (error) {
    console.log('❌ Firestore not available:', error.message);
    console.log('🔧 SOLUTION: Check Firebase project and Firestore setup');
    return results;
  }

  // 5. Проверка подключения к базе данных
  console.log('5️⃣ Testing database connection...');
  try {
    const db = firebase.firestore();
    const testDoc = await db.collection('_test').doc('connection-test').get();
    console.log('✅ Database connection successful');
    results.connection = true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 SOLUTION: Update Firestore security rules');
      console.log('1. Go to Firebase Console → Firestore → Rules');
      console.log('2. Replace with: allow read, write: if true;');
      console.log('3. Click Publish');
    } else if (error.code === 'not-found') {
      console.log('🔧 SOLUTION: Enable Firestore in Firebase Console');
      console.log('1. Go to Firebase Console → Firestore Database');
      console.log('2. Click "Create database"');
      console.log('3. Choose "Start in test mode"');
    } else {
      console.log('🔧 SOLUTION: Check network connection and Firebase project status');
    }
    return results;
  }

  // 6. Проверка правил безопасности
  console.log('6️⃣ Testing security rules...');
  try {
    const db = firebase.firestore();
    const testData = {
      test: true,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('purchases').add(testData);
    console.log('✅ Security rules allow write operations');
    
    // Очищаем тестовую запись
    await docRef.delete();
    console.log('✅ Security rules allow delete operations');
    
    results.rules = true;
  } catch (error) {
    console.log('❌ Security rules test failed:', error.message);
    console.log('🔧 SOLUTION: Update Firestore security rules');
    console.log('1. Go to Firebase Console → Firestore → Rules');
    console.log('2. Replace with:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      allow read, write: if true;
    }
  }
}`);
    console.log('3. Click Publish');
    return results;
  }

  // Итоговый результат
  console.log('');
  console.log('=====================================');
  console.log('📊 DIAGNOSTIC RESULTS');
  console.log('=====================================');
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('🎉 ALL CHECKS PASSED!');
    console.log('✅ Firebase SDK: OK');
    console.log('✅ Configuration: OK');
    console.log('✅ App initialization: OK');
    console.log('✅ Firestore: OK');
    console.log('✅ Database connection: OK');
    console.log('✅ Security rules: OK');
    console.log('');
    console.log('🚀 Your Firebase setup is working perfectly!');
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('Please fix the issues above and run diagnostics again.');
  }

  return results;
}

// Функция для быстрой проверки
async function quickCheck() {
  console.log('⚡ Quick Firebase check...');
  
  try {
    if (typeof firebase === 'undefined') {
      console.log('❌ Firebase SDK not loaded');
      return false;
    }

    const db = firebase.firestore();
    await db.collection('_test').doc('quick-check').set({test: true});
    await db.collection('_test').doc('quick-check').delete();
    
    console.log('✅ Quick check passed');
    return true;
  } catch (error) {
    console.log('❌ Quick check failed:', error.message);
    return false;
  }
}

// Автоматический запуск диагностики
if (typeof window !== 'undefined') {
  // В браузере
  document.addEventListener('DOMContentLoaded', async function() {
    // Ждем немного, чтобы Firebase успел загрузиться
    setTimeout(async () => {
      await diagnoseFirebase();
    }, 2000);
  });
  
  // Делаем функции доступными глобально
  window.diagnoseFirebase = diagnoseFirebase;
  window.quickCheck = quickCheck;
} else {
  // В Node.js
  diagnoseFirebase();
}
