// Email Service for ProfPilot
// Handles sending emails after successful payments

class EmailService {
  constructor() {
    this.emailJSConfig = {
      serviceId: 'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
      templateId: 'payment_confirmation', // EmailJS template ID
      publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
    };
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(purchaseData) {
    try {
      const emailData = {
        to_email: purchaseData.userEmail,
        to_name: purchaseData.userName || 'Valued Customer',
        simulator_name: this.getSimulatorName(purchaseData.simulator),
        amount: purchaseData.amount,
        currency: purchaseData.currency || 'USD',
        payment_method: purchaseData.paymentMethod,
        purchase_id: purchaseData.paymentIntentId || purchaseData.paypalOrderId,
        dashboard_url: `${window.location.origin}/dashboard.html`,
        simulator_url: this.getSimulatorUrl(purchaseData.simulator),
        promo_code: purchaseData.promoCode || null
      };

      // If EmailJS is available, use it
      if (window.emailjs) {
        await this.sendWithEmailJS(emailData);
      } else {
        // Fallback: log email data (for development)
        console.log('📧 Email would be sent:', emailData);
        this.showEmailSentNotification(emailData);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Send email using EmailJS
  async sendWithEmailJS(emailData) {
    return new Promise((resolve, reject) => {
      window.emailjs.send(
        this.emailJSConfig.serviceId,
        this.emailJSConfig.templateId,
        emailData,
        this.emailJSConfig.publicKey
      )
      .then((response) => {
        console.log('✅ Email sent successfully:', response);
        this.showEmailSentNotification(emailData);
        resolve(response);
      })
      .catch((error) => {
        console.error('❌ EmailJS error:', error);
        reject(error);
      });
    });
  }

  // Show notification that email was sent
  showEmailSentNotification(emailData) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <span>Confirmation email sent to ${emailData.to_email}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Get simulator display name
  getSimulatorName(simulatorKey) {
    const names = {
      'ux-designer': 'UX Designer Simulator',
      'lawyer': 'Corporate Lawyer Simulator',
      'corporate-lawyer': 'Corporate Lawyer Simulator'
    };
    return names[simulatorKey] || 'Career Simulator';
  }

  // Get simulator URL
  getSimulatorUrl(simulatorKey) {
    const urls = {
      'ux-designer': '/ux-sim.html',
      'lawyer': '/lawyer-simulator.html',
      'corporate-lawyer': '/lawyer-simulator.html'
    };
    return `${window.location.origin}${urls[simulatorKey] || '/dashboard.html'}`;
  }

  // Send welcome email for new users
  async sendWelcomeEmail(userData) {
    try {
      const emailData = {
        to_email: userData.email,
        to_name: userData.name || 'New User',
        dashboard_url: `${window.location.origin}/dashboard.html`
      };

      if (window.emailjs) {
        await this.sendWithEmailJS({
          ...emailData,
          templateId: 'welcome_email'
        });
      } else {
        console.log('📧 Welcome email would be sent:', emailData);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }
}

// Make EmailService globally available
window.EmailService = EmailService;

// Initialize EmailJS if available
document.addEventListener('DOMContentLoaded', function() {
  // Load EmailJS script if not already loaded
  if (!window.emailjs) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = function() {
      // Initialize EmailJS with your public key
      window.emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
      console.log('✅ EmailJS loaded and initialized');
    };
    document.head.appendChild(script);
  }
});

console.log('📧 Email service loaded');
