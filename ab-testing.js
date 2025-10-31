// A/B Testing Framework for ProfPilot
// Simple but powerful A/B testing implementation

class ABTest {
  constructor(testName, variants, options = {}) {
    this.testName = testName;
    this.variants = variants;
    this.options = {
      trafficSplit: options.trafficSplit || 'equal', // 'equal' or array of percentages
      expirationDays: options.expirationDays || 365,
      ...options
    };
    
    this.userVariant = this.getUserVariant();
    this.trackAssignment();
  }

  // Get user's assigned variant
  getUserVariant() {
    const storageKey = `ab_test_${this.testName}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const data = JSON.parse(stored);
      // Check if expired
      if (Date.now() - data.timestamp > this.options.expirationDays * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(storageKey);
        return this.assignNewVariant(storageKey);
      }
      return data.variant;
    }
    
    return this.assignNewVariant(storageKey);
  }

  // Assign new variant to user
  assignNewVariant(storageKey) {
    let variant;
    
    if (this.options.trafficSplit === 'equal') {
      // Equal split
      variant = this.variants[Math.floor(Math.random() * this.variants.length)];
    } else {
      // Custom split
      variant = this.getVariantBySplit();
    }
    
    // Store assignment
    localStorage.setItem(storageKey, JSON.stringify({
      variant: variant,
      timestamp: Date.now()
    }));
    
    return variant;
  }

  // Get variant based on custom split
  getVariantBySplit() {
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < this.variants.length; i++) {
      cumulative += this.options.trafficSplit[i];
      if (random <= cumulative) {
        return this.variants[i];
      }
    }
    
    return this.variants[this.variants.length - 1];
  }

  // Track assignment
  trackAssignment() {
    if (window.trackEnhanced) {
      window.trackEnhanced('ab_test_assigned', {
        test_name: this.testName,
        variant: this.userVariant,
        all_variants: this.variants
      });
    }
  }

  // Check if user is in specific variant
  isVariant(variant) {
    return this.userVariant === variant;
  }

  // Get current variant
  getVariant() {
    return this.userVariant;
  }

  // Track conversion
  trackConversion(conversionName, value = null) {
    if (window.trackEnhanced) {
      window.trackEnhanced('ab_test_conversion', {
        test_name: this.testName,
        variant: this.userVariant,
        conversion_name: conversionName,
        value: value
      });
    }
  }

  // Run test with callback
  run(callbacks) {
    if (!callbacks || typeof callbacks !== 'object') {
      console.error('ABTest.run() requires an object with variant callbacks');
      return;
    }

    const callback = callbacks[this.userVariant] || callbacks['default'];
    if (callback && typeof callback === 'function') {
      callback(this.userVariant);
    }
  }
}

// Pre-defined A/B Tests

// Pricing Test
class PricingTest extends ABTest {
  constructor() {
    super('pricing', ['A', 'B', 'C'], {
      trafficSplit: [0.33, 0.33, 0.34] // Equal split
    });
  }

  getPrice() {
    const prices = {
      'A': 29,
      'B': 19,
      'C': 39
    };
    return prices[this.userVariant] || 29;
  }

  updateUI() {
    const priceElements = document.querySelectorAll('[data-price]');
    const price = this.getPrice();
    
    priceElements.forEach(el => {
      el.textContent = `$${price}`;
      el.setAttribute('data-ab-price', price);
    });
  }
}

// CTA Test
class CTATest extends ABTest {
  constructor() {
    super('cta_text', ['A', 'B', 'C'], {
      trafficSplit: 'equal'
    });
  }

  getCTAText() {
    const texts = {
      'A': 'Start for $29',
      'B': 'Try Now - $29',
      'C': 'Get Started'
    };
    return texts[this.userVariant] || texts['A'];
  }

  updateUI() {
    const ctaElements = document.querySelectorAll('[data-cta]');
    const text = this.getCTAText();
    
    ctaElements.forEach(el => {
      el.textContent = text;
    });
  }
}

// Landing Page Test
class LandingPageTest extends ABTest {
  constructor() {
    super('landing_layout', ['A', 'B', 'C'], {
      trafficSplit: 'equal'
    });
  }

  applyVariant() {
    const body = document.body;
    
    if (this.isVariant('A')) {
      body.setAttribute('data-layout', 'current');
    } else if (this.isVariant('B')) {
      body.setAttribute('data-layout', 'social-proof-first');
      this.moveSocialProofToTop();
    } else if (this.isVariant('C')) {
      body.setAttribute('data-layout', 'benefits-first');
      this.moveBenefitsToTop();
    }
  }

  moveSocialProofToTop() {
    // Implementation depends on your HTML structure
    const socialProof = document.querySelector('.social-proof');
    const mainContent = document.querySelector('.main-content');
    if (socialProof && mainContent) {
      mainContent.insertBefore(socialProof, mainContent.firstChild);
    }
  }

  moveBenefitsToTop() {
    // Implementation depends on your HTML structure
    const benefits = document.querySelector('.benefits');
    const mainContent = document.querySelector('.main-content');
    if (benefits && mainContent) {
      mainContent.insertBefore(benefits, mainContent.firstChild);
    }
  }
}

// Make globally available
window.ABTest = ABTest;
window.PricingTest = PricingTest;
window.CTATest = CTATest;
window.LandingPageTest = LandingPageTest;

// Auto-initialize common tests on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize pricing test if on pricing page
  if (document.querySelector('[data-price]')) {
    const pricingTest = new PricingTest();
    pricingTest.updateUI();
  }

  // Initialize CTA test if on landing page
  if (document.querySelector('[data-cta]')) {
    const ctaTest = new CTATest();
    ctaTest.updateUI();
  }

  // Initialize landing page test if on homepage
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const landingTest = new LandingPageTest();
    landingTest.applyVariant();
  }
});

console.log('✅ A/B Testing framework loaded');
