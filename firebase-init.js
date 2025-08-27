// Firebase Initialization for ProfPilotEng
// Secure initialization with environment-based configuration

// Wait for DOM and Firebase to be available
document.addEventListener('DOMContentLoaded', function() {
  // Check if Firebase is loaded
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded! Check your script tags.');
    showError('Firebase SDK failed to load. Please refresh the page.');
    return;
  }

  // Check if configuration is available
  if (typeof getFirebaseConfig === 'undefined') {
    console.error('❌ Firebase configuration not found! Check firebase-config.js');
    showError('Firebase configuration missing. Please check setup.');
    return;
  }

  // Get configuration based on environment
  const firebaseConfig = getFirebaseConfig();
  
  // Validate configuration
  if (!isValidFirebaseConfig(firebaseConfig)) {
    console.error('❌ Invalid Firebase configuration!');
    showError('Invalid Firebase configuration. Please check setup.');
    return;
  }

  try {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully for ProfPilotEng');

    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Initialize Analytics only if available
    let analytics = null;
    try {
      if (firebase.analytics) {
        analytics = firebase.analytics();
        console.log('✅ Firebase Analytics initialized');
      }
    } catch (error) {
      console.warn('⚠️ Firebase Analytics not available:', error.message);
    }

    // Make Firebase services globally available (with security checks)
    window.auth = auth;
    window.db = db;
    window.firebase = firebase;

    // Authentication state observer
    auth.onAuthStateChanged((user) => {
      console.log('🔍 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      console.log('📍 Current page:', window.location.pathname);
      
      if (user) {
        console.log('👤 User signed in:', user.email);
        console.log('🔑 User UID:', user.uid);
        console.log('📧 User email verified:', user.emailVerified);
        updateUIForSignedInUser(user);
      } else {
        console.log('👤 User signed out');
        updateUIForSignedOutUser();
      }
    }, (error) => {
      console.error('❌ Authentication error:', error);
      showError(`Authentication error: ${error.message}`);
    });

    // Initialize all functions after Firebase is ready
    initializeFirebaseFunctions(auth, db, analytics);
    
    // Initialize auto-logout timer
    initializeAutoLogout(auth);

  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    showError(`Firebase initialization failed: ${error.message}`);
  }
});

// Configuration validation
function isValidFirebaseConfig(config) {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  for (const field of requiredFields) {
    if (!config[field] || config[field].includes('YOUR_')) {
      console.warn(`⚠️  Missing or placeholder value for: ${field}`);
      return false;
    }
  }
  
  return true;
}

// Error display function
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px;
    background: #dc2626;
    color: white;
    border-radius: 8px;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
  `;
  errorDiv.innerHTML = `<strong>Firebase Error:</strong><br>${message}`;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 10000);
}

// Warning display function
function showWarning(message) {
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px;
    background: #f59e0b;
    color: white;
    border-radius: 8px;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
  `;
  warningDiv.innerHTML = `<strong>Session Warning:</strong><br>${message}`;
  document.body.appendChild(warningDiv);
  
  setTimeout(() => {
    warningDiv.remove();
  }, 15000);
}

// Initialize Firebase functions
function initializeFirebaseFunctions(auth, db, analytics) {
  // Update UI for signed-in user
  window.updateUIForSignedInUser = function(user) {
    try {
      // Update navigation
      const authButtons = document.querySelectorAll('.auth-required');
      const guestButtons = document.querySelectorAll('.guest-only');
      
      authButtons.forEach(btn => btn.style.display = 'block');
      guestButtons.forEach(btn => btn.style.display = 'none');
      
      // Update user info if elements exist
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach(element => {
        element.textContent = user.displayName || user.email;
      });
      
      // Show dashboard link if it exists
      const dashboardLinks = document.querySelectorAll('.dashboard-link');
      dashboardLinks.forEach(link => {
        link.style.display = 'block';
      });
      
      console.log('✅ UI updated for signed-in user');
    } catch (error) {
      console.error('❌ Error updating UI for signed-in user:', error);
    }
  };

  // Update UI for signed-out user
  window.updateUIForSignedOutUser = function() {
    try {
      const authButtons = document.querySelectorAll('.auth-required');
      const guestButtons = document.querySelectorAll('.guest-only');
      
      authButtons.forEach(btn => btn.style.display = 'none');
      guestButtons.forEach(btn => btn.style.display = 'block');
      
      // Hide dashboard link
      const dashboardLinks = document.querySelectorAll('.dashboard-link');
      dashboardLinks.forEach(link => {
        link.style.display = 'none';
      });
      
      console.log('✅ UI updated for signed-out user');
    } catch (error) {
      console.error('❌ Error updating UI for signed-out user:', error);
    }
  };

  // User Progress Management Functions

  // Save user progress for a specific simulator and day
  window.saveUserProgress = async (simulator, day, data) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to save progress');
      }

      const userId = auth.currentUser.uid;
      const progressRef = db.collection('users').doc(userId)
        .collection('progress').doc(simulator);

      await progressRef.set({
        [day]: {
          ...data,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      }, { merge: true });

      console.log(`✅ Progress saved for ${simulator} day ${day}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      throw error;
    }
  };

  // Get user progress for a specific simulator and day
  window.getUserProgress = async (simulator, day) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to get progress');
      }

      const userId = auth.currentUser.uid;
      const progressRef = db.collection('users').doc(userId)
        .collection('progress').doc(simulator);

      const doc = await progressRef.get();
      
      if (doc.exists && doc.data()[day]) {
        return doc.data()[day];
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting progress:', error);
      throw error;
    }
  };

  // Get all user progress for a simulator
  window.getAllUserProgress = async (simulator) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to get progress');
      }

      const userId = auth.currentUser.uid;
      const progressRef = db.collection('users').doc(userId)
        .collection('progress').doc(simulator);

      const doc = await progressRef.get();
      
      if (doc.exists) {
        return doc.data();
      }
      
      return {};
    } catch (error) {
      console.error('❌ Error getting all progress:', error);
      throw error;
    }
  };

  // User Profile Management

  // Save user profile data
  window.saveUserProfile = async (profileData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to save profile');
      }

      const userId = auth.currentUser.uid;
      const userRef = db.collection('users').doc(userId);

      await userRef.set({
        ...profileData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        email: auth.currentUser.email
      }, { merge: true });

      console.log('✅ User profile saved');
      return true;
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  };

  // Get user profile data
  window.getUserProfile = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to get profile');
      }

      const userId = auth.currentUser.uid;
      const userRef = db.collection('users').doc(userId);

      const doc = await userRef.get();
      
      if (doc.exists) {
        return doc.data();
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  };

  // Analytics and Tracking

  // Track user action
  window.trackUserAction = (action, data = {}) => {
    try {
      if (analytics) {
        analytics.logEvent(action, {
          ...data,
          timestamp: Date.now(),
          user_id: auth.currentUser?.uid || 'anonymous'
        });
        console.log(`📊 Event tracked: ${action}`, data);
      }
    } catch (error) {
      console.error('❌ Error tracking event:', error);
    }
  };

  // Track page view
  window.trackPageView = (pageName) => {
    try {
      if (analytics) {
        analytics.logEvent('page_view', {
          page_name: pageName,
          page_title: document.title,
          timestamp: Date.now()
        });
        console.log(`📊 Page view tracked: ${pageName}`);
      }
    } catch (error) {
      console.error('❌ Error tracking page view:', error);
    }
  };

  console.log('✅ Firebase functions initialized successfully');
}

// Auto-logout functionality
function initializeAutoLogout(auth) {
  const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  let logoutTimer;
  let warningTimer;
  
  // Reset timer on user activity
  function resetTimer() {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    if (warningTimer) {
      clearTimeout(warningTimer);
    }
    
    // Set warning timer (1 hour 45 minutes)
    warningTimer = setTimeout(() => {
      showWarning('⚠️ Your session will expire in 15 minutes due to inactivity');
    }, INACTIVITY_TIMEOUT - (15 * 60 * 1000));
    
    // Set logout timer (2 hours)
    logoutTimer = setTimeout(() => {
      showWarning('🔒 Session expired due to inactivity. Logging out...');
      setTimeout(() => {
        auth.signOut().then(() => {
          window.location.href = 'login.html?reason=inactivity';
        });
      }, 2000);
    }, INACTIVITY_TIMEOUT);
  }
  
  // Activity events to reset timer
  const activityEvents = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
  ];
  
  activityEvents.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  // Reset timer on page focus
  window.addEventListener('focus', resetTimer);
  
  // Initialize timer
  resetTimer();
  
  console.log('✅ Auto-logout timer initialized (2 hours inactivity)');
}

// Security warnings
console.warn('🔒 Security: This application uses Firebase with proper authentication and authorization.');
console.warn('📝 Remember: Never expose API keys in client-side code for production applications.');
console.warn('🌐 Consider using Firebase App Check for additional security.');
