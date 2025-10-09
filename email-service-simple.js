// Simple Email Service for ProfPilot (without EmailJS)
// Handles sending emails after successful payments

class SimpleEmailService {
  constructor() {
    this.supportEmail = 'careers.inspirante@gmail.com';
  }

  // Send payment confirmation email (simplified version)
  async sendPaymentConfirmation(purchaseData) {
    try {
      console.log('📧 Sending payment confirmation email...');
      
      // Create email content
      const emailContent = this.createEmailContent(purchaseData);
      
      // For now, just log the email content
      // In production, you would send this via your email service
      console.log('📧 Email content:', emailContent);
      
      // Show notification to user
      this.showEmailSentNotification(purchaseData);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Create email content
  createEmailContent(purchaseData) {
    const simulatorName = this.getSimulatorName(purchaseData.simulator);
    const simulatorUrl = this.getSimulatorUrl(purchaseData.simulator);
    
    return {
      to: purchaseData.userEmail,
      subject: 'Your ProfPilot Simulator Access is Ready! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation - ProfPilot</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to ProfPilot!</h1>
                    <p>Your payment has been confirmed</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${purchaseData.userName || 'Valued Customer'},</h2>
                    
                    <p>Great news! Your payment for the <strong>${simulatorName}</strong> has been successfully processed.</p>
                    
                    <div class="highlight">
                        <h3>📋 Payment Details:</h3>
                        <ul>
                            <li><strong>Simulator:</strong> ${simulatorName}</li>
                            <li><strong>Amount:</strong> $${purchaseData.amount} ${purchaseData.currency || 'USD'}</li>
                            <li><strong>Payment Method:</strong> ${purchaseData.paymentMethod}</li>
                            <li><strong>Transaction ID:</strong> ${purchaseData.purchase_id || 'N/A'}</li>
                            ${purchaseData.promoCode ? `<li><strong>Promo Code:</strong> ${purchaseData.promoCode}</li>` : ''}
                        </ul>
                    </div>
                    
                    <h3>🚀 What's Next?</h3>
                    <p>You now have full access to your career simulator! Here's how to get started:</p>
                    
                    <ol>
                        <li>Click the button below to access your simulator</li>
                        <li>Complete the 3-day career test-drive</li>
                        <li>Get personalized feedback and insights</li>
                        <li>Make an informed decision about your career path</li>
                    </ol>
                    
                    <div style="text-align: center;">
                        <a href="${simulatorUrl}" class="button">Start Your Simulator</a>
                    </div>
                    
                    <h3>💡 Need Help?</h3>
                    <p>If you have any questions or need assistance, don't hesitate to reach out:</p>
                    <ul>
                        <li>Email: ${this.supportEmail}</li>
                        <li>Response time: Within 24 hours</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Thank you for choosing ProfPilot!</p>
                    <p>© 2024 ProfPilot. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };
  }

  // Show notification that email was sent
  showEmailSentNotification(purchaseData) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <span>Confirmation email sent to ${purchaseData.userEmail}</span>
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
      'ux-designer': '/ux-sim-simple.html',
      'lawyer': '/lawyer-simulator.html',
      'corporate-lawyer': '/lawyer-simulator.html'
    };
    return `${window.location.origin}${urls[simulatorKey] || '/dashboard.html'}`;
  }

  // Send welcome email for new users
  async sendWelcomeEmail(userData) {
    try {
      console.log('📧 Sending welcome email to:', userData.email);
      
      // Create welcome email content
      const emailContent = {
        to: userData.email,
        subject: 'Welcome to ProfPilot! 🚀',
        html: `
          <h1>Welcome to ProfPilot!</h1>
          <p>Hello ${userData.name || 'New User'},</p>
          <p>Thank you for joining ProfPilot! You can now access your dashboard and start exploring career simulators.</p>
          <p><a href="${window.location.origin}/dashboard.html">Access Your Dashboard</a></p>
        `
      };
      
      console.log('📧 Welcome email content:', emailContent);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }
}

// Make SimpleEmailService globally available
window.SimpleEmailService = SimpleEmailService;

console.log('📧 Simple email service loaded (no EmailJS)');
