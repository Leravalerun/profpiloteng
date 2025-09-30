// PayPal Integration for ProfPilot
// Handles PayPal payments for career simulators

class PayPalIntegration {
  constructor() {
    this.isInitialized = false;
    this.currentSimulator = null;
    this.init();
  }

  async init() {
    try {
      // Wait for PayPal SDK to load
      await this.waitForPayPal();
      
      // Initialize PayPal buttons
      this.initializePayPalButtons();
      
      this.isInitialized = true;
      console.log('✅ PayPal Integration initialized successfully');
    } catch (error) {
      console.error('❌ PayPal Integration failed to initialize:', error);
    }
  }

  waitForPayPal() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkPayPal = () => {
        if (window.paypal) {
          resolve();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkPayPal, 100);
        } else {
          reject(new Error('PayPal SDK failed to load'));
        }
      };
      
      checkPayPal();
    });
  }

  initializePayPalButtons() {
    // Get simulator from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    this.currentSimulator = urlParams.get('role') || 'ux-designer';
    
    const price = window.SIMULATOR_PRICES[this.currentSimulator] || 29.00;
    const description = window.SIMULATOR_DESCRIPTIONS[this.currentSimulator] || 'Career Simulator';
    
    console.log('🎯 Initializing PayPal for:', {
      simulator: this.currentSimulator,
      price: price,
      description: description
    });

    // Render PayPal buttons
    if (window.paypal && document.getElementById('paypal-button-container')) {
      window.paypal.Buttons({
        createOrder: (data, actions) => this.createOrder(data, actions, price, description),
        onApprove: (data, actions) => this.onApprove(data, actions),
        onError: (err) => this.onError(err),
        onCancel: (data) => this.onCancel(data),
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45
        }
      }).render('#paypal-button-container');
    }
  }

  createOrder(data, actions, price, description) {
    console.log('🛒 Creating PayPal order:', { price, description });
    
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: price.toFixed(2),
          currency_code: window.PAYPAL_CONFIG.currency
        },
        description: description,
        custom_id: `simulator_${this.currentSimulator}_${Date.now()}`
      }],
      application_context: {
        brand_name: 'ProfPilot',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    });
  }

  async onApprove(data, actions) {
    try {
      console.log('💳 PayPal payment approved:', data);
      
      // Show loading state
      this.showResult('Processing payment...', 'loading');
      
      // Capture the payment
      const details = await actions.order.capture();
      console.log('✅ Payment captured successfully:', details);
      
      // Save purchase to Firebase
      await this.savePurchase(details);
      
      // Show success message
      this.showResult('Payment successful! Redirecting to simulator...', 'success');
      
      // Redirect to simulator after 2 seconds
      setTimeout(() => {
        this.redirectToSimulator();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Payment capture failed:', error);
      this.showResult('Payment processing failed. Please try again.', 'error');
    }
  }

  onError(err) {
    console.error('❌ PayPal error:', err);
    this.showResult(`Payment error: ${err.message || 'Unknown error occurred'}`, 'error');
  }

  onCancel(data) {
    console.log('⚠️ Payment cancelled by user:', data);
    this.showResult('Payment cancelled. You can try again anytime.', 'warning');
  }

  async savePurchase(paymentDetails) {
    try {
      if (!window.auth || !window.auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const purchase = {
        id: paymentDetails.id,
        simulator: this.currentSimulator,
        amount: parseFloat(paymentDetails.purchase_units[0].payments.captures[0].amount.value),
        currency: paymentDetails.purchase_units[0].payments.captures[0].amount.currency_code,
        status: paymentDetails.status,
        payerEmail: paymentDetails.payer.email_address,
        payerName: `${paymentDetails.payer.name.given_name} ${paymentDetails.payer.name.surname}`,
        createdAt: new Date(),
        paymentMethod: 'paypal'
      };

      // Save to Firestore
      await window.db.collection('purchases').doc(paymentDetails.id).set(purchase);
      
      // Update user's simulator access
      await this.grantSimulatorAccess(purchase);
      
      console.log('✅ Purchase saved successfully');
      
    } catch (error) {
      console.error('❌ Failed to save purchase:', error);
      throw error;
    }
  }

  async grantSimulatorAccess(purchase) {
    try {
      const userId = window.auth.currentUser.uid;
      const accessData = {
        simulator: purchase.simulator,
        purchasedAt: purchase.createdAt,
        purchaseId: purchase.id,
        status: 'active'
      };

      // Save to user's access collection
      await window.db.collection('users').doc(userId).collection('simulatorAccess').doc(purchase.simulator).set(accessData);
      
      console.log('✅ Simulator access granted');
      
    } catch (error) {
      console.error('❌ Failed to grant simulator access:', error);
      throw error;
    }
  }

  redirectToSimulator() {
    const simulatorUrls = {
      'ux-designer': '/ux-sim.html',
      'lawyer': '/lawyer-simulator.html'
    };
    
    const simulatorUrl = simulatorUrls[this.currentSimulator] || '/dashboard.html';
    window.location.href = simulatorUrl;
  }

  showResult(message, type) {
    const resultElement = document.getElementById('result');
    if (!resultElement) return;

    resultElement.classList.remove('hidden');
    
    // Remove existing type classes
    resultElement.className = 'p-4 rounded-lg';
    
    // Add appropriate classes based on type
    switch (type) {
      case 'success':
        resultElement.classList.add('bg-green-100', 'border', 'border-green-200');
        break;
      case 'error':
        resultElement.classList.add('bg-red-100', 'border', 'border-red-200');
        break;
      case 'warning':
        resultElement.classList.add('bg-yellow-100', 'border', 'border-yellow-200');
        break;
      case 'loading':
        resultElement.classList.add('bg-blue-100', 'border', 'border-blue-200');
        break;
      default:
        resultElement.classList.add('bg-gray-100', 'border', 'border-gray-200');
    }
    
    resultElement.innerHTML = `
      <h4 class="font-medium mb-2">${this.getIcon(type)} ${this.getTitle(type)}</h4>
      <p class="text-sm">${message}</p>
    `;
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      loading: '⏳'
    };
    return icons[type] || 'ℹ️';
  }

  getTitle(type) {
    const titles = {
      success: 'Success!',
      error: 'Error',
      warning: 'Cancelled',
      loading: 'Processing...'
    };
    return titles[type] || 'Info';
  }
}

// Initialize PayPal integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Firebase to initialize
  setTimeout(() => {
    if (window.PAYPAL_CONFIG && window.SIMULATOR_PRICES) {
      new PayPalIntegration();
    } else {
      console.error('❌ PayPal configuration not loaded');
    }
  }, 1000);
});

