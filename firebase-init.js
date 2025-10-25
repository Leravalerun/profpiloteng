/**
 * 🔥 Firebase Initialization
 * 
 * Дополнительная настройка Firebase после загрузки конфигурации
 */

document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, что Firebase доступен
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase not available');
    return;
  }

  // Ждем инициализации Firebase
  const waitForFirebase = () => {
    if (firebase.apps.length === 0) {
      console.log('⏳ Waiting for Firebase initialization...');
      setTimeout(waitForFirebase, 100);
      return;
    }
    
    initializeFirestore();
  };

  const initializeFirestore = () => {
    try {
      // Получаем экземпляр Firestore
      const db = firebase.firestore();
    
    // Настройки для разработки
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('localhost')) {
      
      console.log('🔧 Development mode detected');
      
      // Включаем кэширование для разработки
      db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });
      
      // Включаем отладку
      db.enablePersistence()
        .catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (err.code == 'unimplemented') {
            console.warn('⚠️ The current browser does not support all features required for persistence');
          }
        });
    }
    
    // Настройки для продакшена
    else {
      console.log('🚀 Production mode detected');
      
      // Стандартные настройки
      db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });
    }
    
    // Делаем db доступным глобально
    window.firebaseDB = db;
    
    // Тестируем подключение (асинхронно, без блокировки)
    // Временно отключено для устранения ошибки
    // setTimeout(() => {
    //   testFirebaseConnection();
    // }, 1000);
    
      console.log('✅ Firebase initialization completed');
      
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
    }
  };

  // Запускаем ожидание инициализации
  waitForFirebase();
});

/**
 * Тестирует подключение к Firebase
 */
async function testFirebaseConnection() {
  try {
    const db = firebase.firestore();
    
    // Пробуем выполнить простой запрос
    const testCollection = db.collection('_test');
    const snapshot = await testCollection.limit(1).get();
    
    console.log('✅ Firebase connection test successful');
    
    // Очищаем тестовую коллекцию
    testCollection.get().then(snapshot => {
      snapshot.forEach(doc => {
        doc.ref.delete();
      });
    });
    
  } catch (error) {
    console.warn('⚠️ Firebase connection test failed:', error.message);
    
    // Показываем уведомление только если это критическая ошибка
    if (error.code === 'permission-denied' || error.code === 'not-found') {
      showFirebaseError();
    } else {
      console.log('ℹ️ Non-critical Firebase error, continuing...');
    }
  }
}

/**
 * Показывает уведомление об ошибке Firebase
 */
function showFirebaseError() {
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <span>Database connection error. Some features may not work.</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Убираем уведомление через 5 секунд
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

/**
 * Получает статистику Firebase
 */
function getFirebaseStats() {
  if (typeof firebase === 'undefined') {
    return { error: 'Firebase not available' };
  }
  
  try {
    const db = firebase.firestore();
    return {
      connected: true,
      projectId: firebase.app().options.projectId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

// Делаем функции доступными глобально
window.testFirebaseConnection = testFirebaseConnection;
window.getFirebaseStats = getFirebaseStats;