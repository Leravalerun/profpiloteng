/**
 * 🔍 Firestore Rules Checker
 * 
 * Проверяет текущие правила безопасности Firestore
 * и предлагает исправления
 */

console.log('🔍 Checking Firestore rules...');

// Функция для проверки правил
async function checkFirestoreRules() {
  try {
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase not loaded');
      return;
    }

    const db = firebase.firestore();
    
    // Пробуем создать тестовую запись
    console.log('🧪 Testing write permissions...');
    
    const testData = {
      userId: 'test@example.com',
      simulator: 'ux-designer',
      amount: 29.00,
      currency: 'USD',
      status: 'test',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      testRecord: true
    };

    const docRef = await db.collection('purchases').add(testData);
    console.log('✅ Write test successful:', docRef.id);

    // Пробуем прочитать данные
    console.log('🧪 Testing read permissions...');
    const snapshot = await db.collection('purchases').limit(1).get();
    console.log('✅ Read test successful:', snapshot.size, 'records found');

    // Удаляем тестовую запись
    console.log('🧪 Testing delete permissions...');
    await docRef.delete();
    console.log('✅ Delete test successful');

    console.log('🎉 All Firestore rules tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Firestore rules test failed:', error);
    
    if (error.code === 'permission-denied') {
      console.log('');
      console.log('🔧 SOLUTION: Update Firestore rules in Firebase Console');
      console.log('1. Go to: https://console.firebase.google.com/');
      console.log('2. Select project: profpiloteng');
      console.log('3. Go to Firestore Database → Rules');
      console.log('4. Replace rules with:');
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /purchases/{purchaseId} {
      allow read, write: if true;
    }
  }
}`);
      console.log('5. Click "Publish"');
    }
    
    return false;
  }
}

// Функция для проверки конфигурации
function checkFirebaseConfig() {
  console.log('🔍 Checking Firebase configuration...');
  
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded');
    return false;
  }

  if (typeof window.firebaseConfig === 'undefined') {
    console.error('❌ Firebase config not found');
    return false;
  }

  const config = window.firebaseConfig;
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  for (const field of requiredFields) {
    if (!config[field] || config[field].includes('your-') || config[field].includes('placeholder')) {
      console.error(`❌ Firebase config field '${field}' is not properly configured`);
      return false;
    }
  }

  console.log('✅ Firebase configuration looks good');
  return true;
}

// Основная функция проверки
async function runFirebaseCheck() {
  console.log('🚀 Starting Firebase system check...');
  console.log('=====================================');
  
  // Проверяем конфигурацию
  const configOk = checkFirebaseConfig();
  if (!configOk) {
    console.log('❌ Configuration check failed. Please fix firebase-config.js');
    return;
  }

  // Проверяем правила Firestore
  const rulesOk = await checkFirestoreRules();
  if (!rulesOk) {
    console.log('❌ Firestore rules check failed. Please update rules in Firebase Console');
    return;
  }

  console.log('');
  console.log('🎉 All checks passed! Firebase is ready to use.');
  console.log('✅ Configuration: OK');
  console.log('✅ Firestore rules: OK');
  console.log('✅ Database access: OK');
}

// Запускаем проверку
if (typeof window !== 'undefined') {
  // В браузере
  document.addEventListener('DOMContentLoaded', runFirebaseCheck);
} else {
  // В Node.js
  runFirebaseCheck();
}

// Экспортируем функции для использования
if (typeof window !== 'undefined') {
  window.checkFirebaseConfig = checkFirebaseConfig;
  window.checkFirestoreRules = checkFirestoreRules;
  window.runFirebaseCheck = runFirebaseCheck;
}
