/**
 * 🔥 Firebase Configuration - Offline Mode
 * 
 * Временная конфигурация для работы без Firebase
 * Использует localStorage для хранения данных
 */

console.log('🔧 Firebase offline mode enabled');

// Создаем заглушку для Firebase
window.firebase = {
  app: () => ({ name: '[DEFAULT]' }),
  firestore: () => ({
    collection: (name) => ({
      add: async (data) => {
        const id = 'offline_' + Date.now();
        const record = { id, ...data, createdAt: new Date().toISOString() };
        const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
        records.push(record);
        localStorage.setItem('firestore_' + name, JSON.stringify(records));
        console.log('✅ Offline write successful:', id);
        return { id };
      },
      get: async () => ({
        forEach: (callback) => {
          const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
          records.forEach(record => {
            callback({
              id: record.id,
              data: () => record,
              ref: {
                delete: async () => {
                  const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
                  const filtered = records.filter(r => r.id !== record.id);
                  localStorage.setItem('firestore_' + name, JSON.stringify(filtered));
                  console.log('✅ Offline delete successful:', record.id);
                }
              }
            });
          });
        },
        size: JSON.parse(localStorage.getItem('firestore_' + name) || '[]').length
      }),
      limit: (count) => ({
        get: async () => {
          const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
          return {
            forEach: (callback) => {
              records.slice(0, count).forEach(record => {
                callback({
                  id: record.id,
                  data: () => record,
                  ref: {
                    delete: async () => {
                      const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
                      const filtered = records.filter(r => r.id !== record.id);
                      localStorage.setItem('firestore_' + name, JSON.stringify(filtered));
                      console.log('✅ Offline delete successful:', record.id);
                    }
                  }
                });
              });
            },
            size: Math.min(records.length, count)
          };
        }
      }),
      where: (field, operator, value) => ({
        get: async () => {
          const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
          const filtered = records.filter(record => {
            if (operator === '==') return record[field] === value;
            return true;
          });
          return {
            forEach: (callback) => {
              filtered.forEach(record => {
                callback({
                  id: record.id,
                  data: () => record,
                  ref: {
                    delete: async () => {
                      const records = JSON.parse(localStorage.getItem('firestore_' + name) || '[]');
                      const filtered = records.filter(r => r.id !== record.id);
                      localStorage.setItem('firestore_' + name, JSON.stringify(filtered));
                      console.log('✅ Offline delete successful:', record.id);
                    }
                  }
                });
              });
            },
            size: filtered.length
          };
        }
      })
    })
  }),
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date().toISOString()
    }
  }
};

// Создаем заглушку для конфигурации
window.firebaseConfig = {
  apiKey: "offline-mode",
  authDomain: "offline.local",
  projectId: "offline",
  storageBucket: "offline.appspot.com",
  messagingSenderId: "000000000",
  appId: "offline-app"
};

// Создаем заглушку для базы данных
window.firebaseDB = window.firebase.firestore();

console.log('✅ Firebase offline mode initialized');
console.log('📝 Data will be stored in localStorage');
console.log('🔄 Switch to firebase-config.js when Firebase is ready');
