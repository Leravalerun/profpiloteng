// Enhanced Analytics for ProfPilot
// Comprehensive event tracking for data-driven decisions

class EnhancedAnalytics {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.userId = null;
    this.cohortId = this.getCohortId();
    this.pageStartTime = Date.now();
    
    // Track session start
    this.trackSessionStart();
  }

  // Get or create session ID
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Get cohort ID (month of signup)
  getCohortId() {
    const signupDate = localStorage.getItem('user_signup_date');
    if (signupDate) {
      const date = new Date(signupDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    return null;
  }

  // Set user ID
  setUserId(userId) {
    this.userId = userId;
    if (!localStorage.getItem('user_signup_date')) {
      localStorage.setItem('user_signup_date', new Date().toISOString());
    }
  }

  // Get base event properties
  getBaseProperties() {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      cohort_id: this.cohortId,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer,
      device_type: this.getDeviceType(),
      browser: this.getBrowser(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language
    };
  }

  // Get device type
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Get browser
  getBrowser() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'chrome';
    if (ua.indexOf('Firefox') > -1) return 'firefox';
    if (ua.indexOf('Safari') > -1) return 'safari';
    if (ua.indexOf('Edge') > -1) return 'edge';
    return 'other';
  }

  // Track session start
  trackSessionStart() {
    this.trackEvent('session_start', {
      ...this.getBaseProperties(),
      time_on_page: Date.now() - this.pageStartTime
    });
  }

  // Enhanced track event
  trackEvent(eventName, properties = {}) {
    const eventData = {
      ...this.getBaseProperties(),
      ...properties
    };

    // Send to Firebase Analytics
    if (window.trackEvent) {
      window.trackEvent(eventName, eventData);
    }

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    }

    // Log to console in development
    if (window.location.hostname === 'localhost') {
      console.log(`📊 Analytics: ${eventName}`, eventData);
    }

    // Store in localStorage for offline sync
    this.storeEvent(eventName, eventData);
  }

  // Store event for offline sync
  storeEvent(eventName, eventData) {
    try {
      const events = JSON.parse(localStorage.getItem('pending_events') || '[]');
      events.push({ event: eventName, data: eventData, timestamp: Date.now() });
      localStorage.setItem('pending_events', JSON.stringify(events.slice(-50))); // Keep last 50
    } catch (e) {
      console.error('Failed to store event:', e);
    }
  }

  // Funnel Tracking
  trackFunnelStep(step, properties = {}) {
    this.trackEvent('funnel_step', {
      funnel_step: step,
      ...properties
    });
  }

  // Revenue Tracking
  trackPurchase(simulator, amount, paymentMethod, promoCode = null) {
    this.trackEvent('purchase', {
      simulator: simulator,
      amount: amount,
      currency: 'USD',
      payment_method: paymentMethod,
      promo_code: promoCode,
      revenue: amount,
      cohort_id: this.cohortId
    });
  }

  // Engagement Tracking
  trackSimulatorStart(simulator) {
    this.trackEvent('simulator_started', {
      simulator: simulator,
      cohort_id: this.cohortId,
      days_since_signup: this.getDaysSinceSignup()
    });
  }

  trackSimulatorCompletion(simulator, daysTaken, tasksCompleted) {
    this.trackEvent('simulator_completed', {
      simulator: simulator,
      days_taken: daysTaken,
      tasks_completed: tasksCompleted,
      cohort_id: this.cohortId,
      completion_rate: tasksCompleted / this.getTotalTasks(simulator)
    });
  }

  trackTaskCompletion(simulator, day, task, timeSpent) {
    this.trackEvent('task_completed', {
      simulator: simulator,
      day: day,
      task: task,
      time_spent: timeSpent,
      cohort_id: this.cohortId
    });
  }

  // Error Tracking
  trackError(errorType, errorMessage, errorLocation) {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      error_location: errorLocation,
      severity: this.getErrorSeverity(errorType)
    });
  }

  getErrorSeverity(errorType) {
    if (['payment_failed', 'auth_failed'].includes(errorType)) return 'high';
    if (['load_failed', 'api_error'].includes(errorType)) return 'medium';
    return 'low';
  }

  // Helper methods
  getDaysSinceSignup() {
    const signupDate = localStorage.getItem('user_signup_date');
    if (!signupDate) return 0;
    const days = Math.floor((Date.now() - new Date(signupDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  }

  getTotalTasks(simulator) {
    const taskCounts = {
      'ux-designer': 12,
      'lawyer': 10
    };
    return taskCounts[simulator] || 10;
  }

  // Page view with time tracking
  trackPageView(pageName, properties = {}) {
    const timeOnPreviousPage = Date.now() - this.pageStartTime;
    if (timeOnPreviousPage > 0) {
      this.trackEvent('page_time', {
        page: document.title,
        time_spent: timeOnPreviousPage
      });
    }

    this.pageStartTime = Date.now();
    this.trackEvent('page_view', {
      page_name: pageName,
      page_title: document.title,
      ...properties
    });
  }
}

// Make globally available
window.EnhancedAnalytics = EnhancedAnalytics;

// Initialize on load
let analyticsInstance = null;
document.addEventListener('DOMContentLoaded', function() {
  analyticsInstance = new EnhancedAnalytics();
  
  // Track page view
  analyticsInstance.trackPageView(window.location.pathname);
  
  // Track time on page before unload
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Date.now() - analyticsInstance.pageStartTime;
    if (timeOnPage > 5000) { // Only track if > 5 seconds
      analyticsInstance.trackEvent('page_time', {
        page: document.title,
        time_spent: timeOnPage
      });
    }
  });
});

// Helper function for easy access
window.trackEnhanced = function(eventName, properties) {
  if (analyticsInstance) {
    analyticsInstance.trackEvent(eventName, properties);
  }
};

console.log('✅ Enhanced Analytics loaded');
