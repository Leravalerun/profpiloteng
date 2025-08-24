// Firebase Configuration for ProfPilot
// Real configuration from Firebase Console

// Wait for Firebase to be available
document.addEventListener('DOMContentLoaded', function() {
  // Check if Firebase is loaded
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded!');
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyAetVvQl103Lz3MRk0ywr-_9xh9E6iCaCk",
    authDomain: "profpilotru.firebaseapp.com",
    projectId: "profpilotru",
    storageBucket: "profpilotru.firebasestorage.app",
    messagingSenderId: "108290999775",
    appId: "1:108290999775:web:56b1add2e841523410f06a",
    measurementId: "G-YV0GRVYKEC"
  };

  try {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully for ProfPilot');

    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    const analytics = firebase.analytics(); // Optional

    // Make Firebase services globally available
    window.auth = auth;
    window.db = db;
    window.firebase = firebase;

    // Authentication state observer
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.email);
        // Update UI for signed-in user
        updateUIForSignedInUser(user);
      } else {
        console.log('User is signed out');
        // Update UI for signed-out user
        updateUIForSignedOutUser();
      }
    });

    // Initialize all functions after Firebase is ready
    initializeFirebaseFunctions(auth, db, analytics);

  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
});

// Initialize Firebase functions
function initializeFirebaseFunctions(auth, db, analytics) {
  // Update UI for signed-in user
  window.updateUIForSignedInUser = function(user) {
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
  };

  // Update UI for signed-out user
  window.updateUIForSignedOutUser = function() {
    const authButtons = document.querySelectorAll('.auth-required');
    const guestButtons = document.querySelectorAll('.guest-only');
    
    authButtons.forEach(btn => btn.style.display = 'none');
    guestButtons.forEach(btn => btn.style.display = 'block');
    
    // Hide dashboard link
    const dashboardLinks = document.querySelectorAll('.dashboard-link');
    dashboardLinks.forEach(link => {
      link.style.display = 'none';
    });
  };

  // User Progress Management Functions

  // Save user progress for a specific simulator and day
  window.saveUserProgress = async (simulator, day, data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return false;
      }
      
      await db.collection('users').doc(user.uid)
        .collection('progress').doc(simulator)
        .set({
          [day]: data,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      
      console.log(`Progress saved for ${simulator} - ${day}`);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  };

  // Get user progress for a specific simulator
  window.getUserProgress = async (simulator) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return null;
      }
      
      const doc = await db.collection('users').doc(user.uid)
        .collection('progress').doc(simulator)
        .get();
      
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  };

  // Save complete user data (profile, progress, etc.)
  window.saveUserData = async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return false;
      }
      
      await db.collection('users').doc(user.uid).set({
        ...userData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      console.log('User data saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  // Get complete user data
  window.getUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
          console.error('No user signed in');
          return null;
      }
      
      const doc = await db.collection('users').doc(user.uid).get();
      
      if (doc.exists) {
          return doc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  // Purchase Management Functions

  // Save purchase record
  window.savePurchase = async (purchaseData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return false;
      }
      
      await db.collection('users').doc(user.uid)
        .collection('purchases').add({
          ...purchaseData,
          purchasedAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'active'
        });
      
      console.log('Purchase saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving purchase:', error);
      return false;
    }
  };

  // Get user purchases
  window.getUserPurchases = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return [];
      }
      
      const snapshot = await db.collection('users').doc(user.uid)
        .collection('purchases')
        .orderBy('purchasedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting purchases:', error);
      return [];
    }
  };

  // Achievement Management Functions

  // Save achievement
  window.saveAchievement = async (achievementData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return false;
      }
      
      await db.collection('users').doc(user.uid)
        .collection('achievements').add({
          ...achievementData,
          earnedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      
      console.log('Achievement saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving achievement:', error);
      return false;
    }
  };

  // Get user achievements
  window.getUserAchievements = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user signed in');
        return [];
      }
      
      const snapshot = await db.collection('users').doc(user.uid)
        .collection('achievements')
        .orderBy('earnedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  };

  // Analytics Functions (Optional)

  // Track user action
  window.trackUserAction = (action, data = {}) => {
    try {
      if (analytics) {
        analytics.logEvent(action, {
          user_id: auth.currentUser?.uid || 'anonymous',
          timestamp: Date.now(),
          ...data
        });
      }
    } catch (error) {
      console.error('Error tracking action:', error);
    }
  };

  // Track simulator completion
  window.trackSimulatorCompletion = (simulator, day, score) => {
    trackUserAction('simulator_completion', {
      simulator,
      day,
      score
    });
  };

  // Track assignment completion
  window.trackAssignmentCompletion = (simulator, day, assignment) => {
    trackUserAction('assignment_completion', {
      simulator,
      day,
      assignment
    });
  };

  // Utility Functions

  // Check if user is authenticated
  window.isUserAuthenticated = () => {
    return !!auth.currentUser;
  };

  // Get current user
  window.getCurrentUser = () => {
    return auth.currentUser;
  };

  // Format timestamp for display
  window.formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Error handling utility
  window.handleFirebaseError = (error) => {
    console.error('Firebase error:', error);
    
    let userMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'permission-denied':
        userMessage = 'You don\'t have permission to perform this action.';
        break;
      case 'unauthenticated':
        userMessage = 'Please sign in to continue.';
        break;
      case 'not-found':
        userMessage = 'The requested resource was not found.';
        break;
      case 'already-exists':
        userMessage = 'This resource already exists.';
        break;
      case 'resource-exhausted':
        userMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      case 'failed-precondition':
        userMessage = 'Operation failed. Please check your input and try again.';
        break;
      case 'aborted':
        userMessage = 'Operation was cancelled.';
        break;
      case 'out-of-range':
        userMessage = 'Operation is out of valid range.';
        break;
      case 'unimplemented':
        userMessage = 'This feature is not yet implemented.';
        break;
      case 'internal':
        userMessage = 'Internal error. Please try again later.';
        break;
      case 'unavailable':
        userMessage = 'Service is currently unavailable. Please try again later.';
        break;
      case 'data-loss':
        userMessage = 'Data loss occurred. Please contact support.';
        break;
    }
    
    return userMessage;
  };

  console.log('Firebase functions initialized successfully');
  console.log('Available functions: saveUserProgress, getUserProgress, saveUserData, getUserData, savePurchase, getUserPurchases, saveAchievement, getUserAchievements, trackUserAction, isUserAuthenticated, getCurrentUser, formatTimestamp, handleFirebaseError');
}
