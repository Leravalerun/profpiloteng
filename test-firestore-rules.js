/**
 * 🧪 Firestore Rules Tester
 * 
 * Быстро тестирует правила Firestore и показывает результат
 */

async function testFirestoreRules() {
  console.log('🧪 Testing Firestore rules...');
  
  try {
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase not loaded');
      return false;
    }

    const db = firebase.firestore();
    
    // Тест 1: Чтение
    console.log('📖 Testing read permissions...');
    try {
      await db.collection('purchases').limit(1).get();
      console.log('✅ Read permissions: OK');
    } catch (error) {
      console.error('❌ Read permissions failed:', error.message);
      return false;
    }

    // Тест 2: Запись
    console.log('✍️ Testing write permissions...');
    try {
      const testData = {
        test: true,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection('purchases').add(testData);
      console.log('✅ Write permissions: OK');
      
      // Очистка
      await docRef.delete();
      console.log('✅ Delete permissions: OK');
    } catch (error) {
      console.error('❌ Write permissions failed:', error.message);
      return false;
    }

    // Тест 3: Тестовая коллекция
    console.log('🧪 Testing _test collection...');
    try {
      const testData = { test: true };
      const docRef = await db.collection('_test').add(testData);
      await docRef.delete();
      console.log('✅ _test collection: OK');
    } catch (error) {
      console.warn('⚠️ _test collection failed:', error.message);
    }

    console.log('🎉 All Firestore rules tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Firestore rules test failed:', error);
    return false;
  }
}

// Автоматический запуск
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(async () => {
      const success = await testFirestoreRules();
      if (success) {
        console.log('✅ Firestore rules are working correctly!');
      } else {
        console.log('❌ Firestore rules need to be updated');
        console.log('🔧 Go to Firebase Console → Firestore → Rules');
        console.log('Set: allow read, write: if true;');
      }
    }, 2000);
  });
  
  window.testFirestoreRules = testFirestoreRules;
}
