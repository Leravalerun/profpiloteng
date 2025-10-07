# Email Templates for ProfPilot

## 📧 Payment Confirmation Email

### Subject: Your ProfPilot Simulator Access is Ready! 🚀

### HTML Template:
```html
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
            <h2>Hello {{to_name}},</h2>
            
            <p>Great news! Your payment for the <strong>{{simulator_name}}</strong> has been successfully processed.</p>
            
            <div class="highlight">
                <h3>📋 Payment Details:</h3>
                <ul>
                    <li><strong>Simulator:</strong> {{simulator_name}}</li>
                    <li><strong>Amount:</strong> ${{amount}} {{currency}}</li>
                    <li><strong>Payment Method:</strong> {{payment_method}}</li>
                    <li><strong>Transaction ID:</strong> {{purchase_id}}</li>
                    {{#if promo_code}}<li><strong>Promo Code:</strong> {{promo_code}}</li>{{/if}}
                </ul>
            </div>
            
            <h3>🚀 What's Next?</h3>
            <p>You now have full access to your career simulator! Here's how to get started:</p>
            
            <ol>
                <li><strong>Access Your Dashboard:</strong> Click the button below to go to your personal dashboard</li>
                <li><strong>Start Your Simulator:</strong> Begin your 3-day career test-drive</li>
                <li><strong>Complete Tasks:</strong> Work through real-world scenarios</li>
                <li><strong>Get Feedback:</strong> Receive guidance from industry professionals</li>
            </ol>
            
            <div style="text-align: center;">
                <a href="{{dashboard_url}}" class="button">🎯 Go to Dashboard</a>
                <br>
                <a href="{{simulator_url}}" class="button" style="background: #28a745;">🚀 Start Simulator</a>
            </div>
            
            <h3>💡 Pro Tips:</h3>
            <ul>
                <li>Set aside 2-3 hours per day for the best experience</li>
                <li>Take notes as you work through scenarios</li>
                <li>Don't hesitate to ask questions in the feedback sections</li>
                <li>Use this as a real test-drive of the career</li>
            </ul>
            
            <h3>🆘 Need Help?</h3>
            <p>If you have any questions or need assistance, don't hesitate to reach out:</p>
            <ul>
                <li>📧 Email: support@profpilot.com</li>
                <li>💬 Live Chat: Available in your dashboard</li>
                <li>📚 Help Center: Check the FAQ section</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Thank you for choosing ProfPilot!</p>
            <p>© 2024 ProfPilot. All rights reserved.</p>
            <p>This email was sent to {{to_email}}</p>
        </div>
    </div>
</body>
</html>
```

## 📧 Welcome Email (New Users)

### Subject: Welcome to ProfPilot - Your Career Journey Starts Here! 🌟

### HTML Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ProfPilot</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Welcome to ProfPilot!</h1>
            <p>Your career exploration journey begins now</p>
        </div>
        
        <div class="content">
            <h2>Hello {{to_name}},</h2>
            
            <p>Welcome to ProfPilot! We're excited to help you explore different career paths and find the perfect fit for your skills and interests.</p>
            
            <h3>🎯 What is ProfPilot?</h3>
            <p>ProfPilot is a career simulator platform that lets you "test-drive" different professions before committing to a career change. Instead of spending thousands on courses or bootcamps, you can experience real work scenarios in just 3 days.</p>
            
            <h3>🚀 How It Works:</h3>
            <ol>
                <li><strong>Choose a Simulator:</strong> Pick from UX Design, Corporate Law, and more</li>
                <li><strong>Complete Real Tasks:</strong> Work on actual projects you'd encounter in the role</li>
                <li><strong>Get Expert Feedback:</strong> Receive guidance from industry professionals</li>
                <li><strong>Make Informed Decisions:</strong> Decide if the career is right for you</li>
            </ol>
            
            <div style="text-align: center;">
                <a href="{{dashboard_url}}" class="button">🎯 Explore Simulators</a>
            </div>
            
            <h3>💡 Why Choose ProfPilot?</h3>
            <ul>
                <li>✅ <strong>Risk-Free:</strong> Test careers without major commitments</li>
                <li>✅ <strong>Real Experience:</strong> Work on actual projects, not just theory</li>
                <li>✅ <strong>Expert Guidance:</strong> Learn from industry professionals</li>
                <li>✅ <strong>Affordable:</strong> Much cheaper than courses or bootcamps</li>
                <li>✅ <strong>Time-Efficient:</strong> Get insights in just 3 days</li>
            </ul>
            
            <h3>🎁 Special Offer:</h3>
            <p>Use promo code <strong>CHECKPPFF</strong> to get free access to any simulator!</p>
            
            <h3>🆘 Need Help?</h3>
            <p>We're here to help you succeed:</p>
            <ul>
                <li>📧 Email: support@profpilot.com</li>
                <li>💬 Live Chat: Available 24/7</li>
                <li>📚 Help Center: Comprehensive guides and FAQs</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Ready to explore your next career? Let's get started!</p>
            <p>© 2024 ProfPilot. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## 📧 Password Reset Email

### Subject: Reset Your ProfPilot Password

### HTML Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - ProfPilot</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Password Reset Request</h1>
            <p>ProfPilot Account Security</p>
        </div>
        
        <div class="content">
            <h2>Hello {{to_name}},</h2>
            
            <p>We received a request to reset your ProfPilot account password.</p>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
            </div>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{reset_url}}" class="button">🔑 Reset Password</a>
            </div>
            
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            
            <h3>🛡️ Security Tips:</h3>
            <ul>
                <li>Use a strong, unique password</li>
                <li>Don't share your password with anyone</li>
                <li>Log out from shared computers</li>
                <li>Enable two-factor authentication if available</li>
            </ul>
            
            <h3>🆘 Need Help?</h3>
            <p>If you're having trouble resetting your password:</p>
            <ul>
                <li>📧 Email: support@profpilot.com</li>
                <li>💬 Live Chat: Available 24/7</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 ProfPilot. All rights reserved.</p>
            <p>This email was sent to {{to_email}}</p>
        </div>
    </div>
</body>
</html>
```

## 📧 Setup Instructions

### 1. EmailJS Setup:
1. Go to https://www.emailjs.com/
2. Create a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create email templates using the HTML above
5. Get your Service ID, Template ID, and Public Key
6. Update `email-service.js` with your credentials

### 2. Template Variables:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{simulator_name}}` - Name of the simulator
- `{{amount}}` - Payment amount
- `{{currency}}` - Currency (USD)
- `{{payment_method}}` - Payment method used
- `{{purchase_id}}` - Transaction ID
- `{{dashboard_url}}` - Link to dashboard
- `{{simulator_url}}` - Link to simulator
- `{{promo_code}}` - Promo code used (if any)

### 3. Integration:
Add the email service to your payment success handlers:

```javascript
// After successful payment
const emailService = new EmailService();
await emailService.sendPaymentConfirmation(purchaseData);
```
