// Client-side redirects for ProfPilot
// This handles URL redirects when server-side redirects are not available

(function() {
  'use strict';
  
  // Get current path without query parameters
  const currentPath = window.location.pathname;
  const queryString = window.location.search;
  
  // Define redirect mappings
  const redirects = {
    '/checkout': '/checkout.html',
    '/login': '/login.html',
    '/dashboard': '/dashboard.html',
    '/ux': '/ux.html',
    '/lawyer': '/lawyer.html',
    '/ux-sim': '/ux-sim.html',
    '/lawyer-sim': '/lawyer-simulator.html'
  };
  
  // Check if current path needs redirect
  if (redirects[currentPath]) {
    const newUrl = redirects[currentPath] + queryString;
    console.log(`🔄 Redirecting ${currentPath} to ${newUrl}`);
    window.location.replace(newUrl);
    return;
  }
  
  // Handle common variations
  const pathVariations = {
    '/checkout/': '/checkout.html',
    '/login/': '/login.html',
    '/dashboard/': '/dashboard.html',
    '/ux/': '/ux.html',
    '/lawyer/': '/lawyer.html',
    '/ux-sim/': '/ux-sim.html',
    '/lawyer-sim/': '/lawyer-simulator.html'
  };
  
  if (pathVariations[currentPath]) {
    const newUrl = pathVariations[currentPath] + queryString;
    console.log(`🔄 Redirecting ${currentPath} to ${newUrl}`);
    window.location.replace(newUrl);
    return;
  }
  
  console.log('✅ No redirect needed for:', currentPath);
})();
