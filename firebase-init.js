// Firebase Initialization for ProfPilot
// Secure initialization with environment-based configuration

// Wait for DOM and Firebase to be available
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Firebase for ProfPilot...');
  
  // Wait for all scripts to load with retry mechanism
  let retryCount = 0;
  const maxRetries = 20; // Increased retries
  
  function tryInitialize() {
    if (typeof firebase !== 'undefined' && typeof getFirebaseConfig !== 'undefined') {
      // Additional check to ensure Firebase is fully loaded
      if (firebase.apps && firebase.apps.length === 0) {
        initializeFirebase();
      } else if (firebase.apps && firebase.apps.length > 0) {
        console.log('✅ Firebase already initialized');
        // Make sure global variables are available
        if (!window.auth) {
          window.auth = firebase.auth();
          window.db = firebase.firestore();
          window.firebase = firebase;
        }
      } else {
        // Firebase is loaded but not initialized
        initializeFirebase();
      }
    } else if (retryCount < maxRetries) {
      retryCount++;
      console.log(`⏳ Waiting for Firebase scripts... (attempt ${retryCount}/${maxRetries})`);
      setTimeout(tryInitialize, 500); // Increased delay
    } else {
      console.error('❌ Firebase scripts failed to load after maximum retries');
      showError('Firebase configuration missing. Please check setup.');
    }
  }
  
  // Start trying to initialize
  setTimeout(tryInitialize, 100); // Small delay to ensure scripts are loaded
});

function initializeFirebase() {
  // Check if Firebase is already initialized
  if (firebase.apps && firebase.apps.length > 0) {
    console.log('✅ Firebase already initialized, skipping...');
    // Make sure global variables are available
    if (!window.auth) {
      window.auth = firebase.auth();
      window.db = firebase.firestore();
      window.firebase = firebase;
    }
    return;
  }

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
    console.log('✅ Firebase initialized successfully for ProfPilot');

    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Initialize Analytics only if available
    let analytics = null;
    try {
      if (firebase.analytics) {
        analytics = firebase.analytics();
        console.log('✅ Firebase Analytics initialized (legacy)');
      } else if (window.firebaseAnalytics) {
        analytics = window.firebaseAnalytics;
        console.log('✅ Firebase Analytics initialized (modern)');
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
    if (!config[field] || config[field].includes('YOUR_') || config[field].includes('XXXXXXXXXX')) {
      console.warn(`⚠️  Missing or placeholder value for: ${field}`);
      return false;
    }
  }
  
  return true;
}

// Error display function
function showError(message) {
  console.error('❌ Firebase Error:', message);
  
  // Try to show error in UI if possible
  const errorContainer = document.getElementById('error-container') || 
                        document.querySelector('.error-message') ||
                        document.createElement('div');
  
  if (!errorContainer.id) {
    errorContainer.id = 'error-container';
    errorContainer.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
    document.body.appendChild(errorContainer);
  }
  
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

// Warning display function
function showWarning(message) {
  console.warn('⚠️ Warning:', message);
  
  // Try to show warning in UI if possible
  const warningContainer = document.getElementById('warning-container') || 
                          document.querySelector('.warning-message') ||
                          document.createElement('div');
  
  if (!warningContainer.id) {
    warningContainer.id = 'warning-container';
    warningContainer.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50';
    document.body.appendChild(warningContainer);
  }
  
  warningContainer.textContent = message;
  warningContainer.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    warningContainer.style.display = 'none';
  }, 5000);
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

  // Analytics Functions
  
  // Track custom events
  window.trackEvent = (eventName, parameters = {}) => {
    try {
      if (analytics) {
        analytics.logEvent(eventName, parameters);
        console.log(`📊 Analytics event tracked: ${eventName}`, parameters);
      }
    } catch (error) {
      console.warn('⚠️ Analytics tracking failed:', error);
    }
  };

  // Track page views
  window.trackPageView = (pageName) => {
    try {
      if (analytics) {
        analytics.logEvent('page_view', {
          page_title: pageName,
          page_location: window.location.href
        });
        console.log(`📊 Page view tracked: ${pageName}`);
      }
    } catch (error) {
      console.warn('⚠️ Page view tracking failed:', error);
    }
  };

  // Track simulator events
  window.trackSimulatorEvent = (simulator, action, day = null) => {
    try {
      if (analytics) {
        const parameters = {
          simulator_name: simulator,
          action: action
        };
        
        if (day) {
          parameters.day = day;
        }
        
        analytics.logEvent('simulator_interaction', parameters);
        console.log(`📊 Simulator event tracked: ${simulator} - ${action}`, parameters);
      }
    } catch (error) {
      console.warn('⚠️ Simulator tracking failed:', error);
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

  // Purchase Management Functions

  // Save purchase data
  window.savePurchase = async (purchaseData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to save purchase');
      }

      const userId = auth.currentUser.uid;
      const purchaseRef = db.collection('users').doc(userId)
        .collection('purchases').doc(purchaseData.paymentIntentId);

      await purchaseRef.set({
        ...purchaseData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update user's accessible simulators
      await db.collection('users').doc(userId).update({
        accessibleSimulators: firebase.firestore.FieldValue.arrayUnion(purchaseData.simulator),
        lastPurchaseDate: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log('✅ Purchase saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving purchase:', error);
      throw error;
    }
  };

  // Get user purchases
  window.getUserPurchases = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to get purchases');
      }

      const userId = auth.currentUser.uid;
      const purchasesRef = db.collection('users').doc(userId)
        .collection('purchases');

      const snapshot = await purchasesRef.orderBy('createdAt', 'desc').get();
      
      const purchases = [];
      snapshot.forEach(doc => {
        purchases.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return purchases;
    } catch (error) {
      console.error('❌ Error getting purchases:', error);
      throw error;
    }
  };

  // Check if user has access to a simulator
  window.hasSimulatorAccess = async (simulatorName) => {
    try {
      if (!auth.currentUser) {
        return false;
      }
      const userId = auth.currentUser.uid;
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return false;
      }
      
      const userData = userDoc.data();
      const accessibleSimulators = userData.accessibleSimulators || [];
      
      return accessibleSimulators.includes(simulatorName);
    } catch (error) {
      console.error('❌ Error checking simulator access:', error);
      return false;
    }
  };

  // Get user's accessible simulators
  window.getAccessibleSimulators = async () => {
    try {
      if (!auth.currentUser) {
        return [];
      }
      const userId = auth.currentUser.uid;
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return [];
      }
      
      const userData = userDoc.data();
      return userData.accessibleSimulators || [];
    } catch (error) {
      console.error('❌ Error getting accessible simulators:', error);
      return [];
    }
  };

  // Track purchase event
  window.trackPurchase = (simulator, amount, paymentIntentId) => {
    try {
      if (analytics) {
        analytics.logEvent('purchase', {
          simulator: simulator,
          value: amount,
          currency: 'USD',
          payment_intent_id: paymentIntentId,
          user_id: auth.currentUser?.uid || 'anonymous'
        });
        console.log(`📊 Purchase tracked: ${simulator} - $${amount}`);
      }
    } catch (error) {
      console.warn('⚠️ Purchase tracking failed:', error);
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

// Close the initializeFirebase function
}

// Security warnings
console.warn('🔒 Security: This application uses Firebase with proper authentication and authorization.');
console.warn('📝 Remember: Never expose API keys in client-side code for production applications.');
console.warn('🌐 Consider using Firebase App Check for additional security.');
