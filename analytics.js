// Google Analytics 4 (GA4) Configuration
// Add your GA4 Measurement ID here

(function() {
    'use strict';
    
    // Replace 'G-XXXXXXXXXX' with your actual Google Analytics 4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-XSY9VSWFB5';
    
    // Don't track on localhost (development)
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
        console.log('🔧 Analytics: Development mode - tracking disabled');
        return;
    }
    
    // Don't proceed if GA Measurement ID is not configured
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.log('⚠️ Analytics: GA Measurement ID not configured');
        return;
    }
    
    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        });
    `;
    document.head.appendChild(script2);
    
    // Helper function to track events
    window.trackEvent = function(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
            console.log('📊 Analytics Event:', eventName, eventData);
        }
    };
    
    // Helper function to track page views
    window.trackPageView = function(pageName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: pageName,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
            console.log('📊 Analytics Page View:', pageName);
        }
    };
    
    console.log('✅ Analytics: Initialized successfully');
})();
