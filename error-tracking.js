/**
 * Global Error Tracking for ProfPilot
 * Automatically tracks JavaScript errors, unhandled promise rejections, and resource loading failures
 */

(function() {
  'use strict';

  // Wait for analytics to be available
  function getAnalytics() {
    return window.analytics || (window.EnhancedAnalytics ? new window.EnhancedAnalytics() : null);
  }

  // Track error to analytics
  function trackError(error, context = {}) {
    const analytics = getAnalytics();
    if (!analytics) {
      console.error('Analytics not available for error tracking:', error);
      return;
    }

    const errorType = context.error_type || 'javascript_error';
    const errorMessage = error.message || String(error) || 'Unknown error';
    const errorLocation = error.filename || window.location.href;

    // Track error using EnhancedAnalytics method
    analytics.trackError(errorType, errorMessage, errorLocation);

    // Also track as event with full context
    analytics.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      error_location: errorLocation,
      stack: error.stack || '',
      filename: error.filename || '',
      lineno: error.lineno || 0,
      colno: error.colno || 0,
      url: window.location.href,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...context
    });

    // Also log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.error('Tracked error:', { errorType, errorMessage, errorLocation, ...context });
    }
  }

  // 1. Track JavaScript Errors
  window.addEventListener('error', function(event) {
    trackError({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || ''
    }, {
      error_type: 'javascript_error',
      source: event.target?.tagName || 'script'
    });
  }, true);

  // 2. Track Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', function(event) {
    trackError({
      message: event.reason?.message || String(event.reason) || 'Unhandled Promise Rejection',
      stack: event.reason?.stack || ''
    }, {
      error_type: 'unhandled_promise_rejection',
      promise_reason: String(event.reason)
    });
  });

  // 3. Track Resource Loading Errors (images, scripts, etc.)
  window.addEventListener('error', function(event) {
    const target = event.target;
    if (target && target !== window) {
      trackError({
        message: `Failed to load resource: ${target.tagName}`,
        filename: target.src || target.href || ''
      }, {
        error_type: 'resource_load_error',
        resource_type: target.tagName.toLowerCase(),
        resource_url: target.src || target.href || ''
      });
    }
  }, true);

  // 4. Track Firebase Errors
  if (window.firebase) {
    const originalError = console.error;
    console.error = function(...args) {
      if (args.some(arg => String(arg).includes('Firebase'))) {
        trackError({
          message: args.join(' '),
          stack: new Error().stack
        }, {
          error_type: 'firebase_error'
        });
      }
      originalError.apply(console, args);
    };
  }

  // 5. Track Network Errors (fetch failures)
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .catch(function(error) {
        trackError({
          message: error.message || 'Network request failed',
          stack: error.stack
        }, {
          error_type: 'network_error',
          url: args[0] || ''
        });
        throw error;
      });
  };

  // 6. Global error handler function (can be called manually)
  window.trackCustomError = function(error, context = {}) {
    trackError(error, {
      error_type: 'custom_error',
      ...context
    });
  };

  // 7. Track errors in try-catch blocks (helper function)
  window.trackErrorAsync = function(asyncFunction, context = {}) {
    return async function(...args) {
      try {
        return await asyncFunction.apply(this, args);
      } catch (error) {
        trackError(error, {
          error_type: 'async_error',
          ...context
        });
        throw error;
      }
    };
  };

  console.log('✅ Global Error Tracking initialized');
})();

