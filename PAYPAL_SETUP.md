# PayPal Integration Setup for ProfPilot

This guide explains how to set up PayPal payments for the ProfPilot platform.

## 🚀 Quick Setup

### 1. PayPal Developer Account
1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Log in with your PayPal business account
3. Navigate to "My Apps & Credentials"

### 2. Create Production App
1. Click "Create App"
2. Choose "Default Application" or "Web Application"
3. Select "Live" environment
4. Fill in app details:
   - **App Name**: ProfPilot
   - **Merchant**: Your business name
   - **Return URL**: `https://yourdomain.com/paypal-checkout.html`
   - **Cancel URL**: `https://yourdomain.com/checkout.html`

### 3. Get Production Credentials
1. After creating the app, you'll get:
   - **Client ID** (starts with `A...`)
   - **Client Secret** (starts with `E...`)

### 4. Update Configuration Files

#### Update `paypal-config.js`
Replace the production client ID:
```javascript
production: {
  clientId: 'YOUR_ACTUAL_PRODUCTION_CLIENT_ID', // Replace this
  environment: 'production',
  currency: 'USD',
  intent: 'capture'
}
```

#### Update `paypal-checkout.html`
Replace the client ID in the PayPal SDK script:
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_ACTUAL_PRODUCTION_CLIENT_ID&currency=USD&intent=capture"></script>
```

## 🔧 Configuration Details

### Environment Detection
The system automatically detects the environment:
- **Development**: `localhost`, `127.0.0.1`, `*.netlify.app`
- **Production**: All other domains

### Pricing Configuration
Prices are configured in `paypal-config.js`:
```javascript
const SIMULATOR_PRICES = {
  'ux-designer': 29.00,
  'lawyer': 29.00
};
```

### Simulator Descriptions
Descriptions are configured in `paypal-config.js`:
```javascript
const SIMULATOR_DESCRIPTIONS = {
  'ux-designer': 'UX Designer Simulator - 3-day career test-drive',
  'lawyer': 'Corporate Lawyer Simulator - 3-day career test-drive'
};
```

## 📁 File Structure

```
/
├── paypal-config.js              # PayPal configuration
├── paypal-integration.js         # PayPal integration logic
├── paypal-checkout.html          # PayPal checkout page
├── checkout.html                 # Main checkout (updated with PayPal option)
├── test-paypal.html             # Test page for development
└── PAYPAL_SETUP.md              # This setup guide
```

## 🔄 Payment Flow

1. **User clicks "Start — $29"** on simulator page
2. **Redirected to checkout.html** with simulator parameter
3. **User chooses payment method** (Credit Card or PayPal)
4. **If PayPal**: Redirected to paypal-checkout.html
5. **PayPal payment processed** via PayPal SDK
6. **Purchase saved** to Firebase
7. **User redirected** to simulator

## 🧪 Testing

### Development Testing
1. Use `test-paypal.html` for testing
2. Use sandbox credentials
3. Test with PayPal sandbox accounts

### Production Testing
1. Use small amounts for initial testing
2. Test with real PayPal accounts
3. Verify webhook handling

## 🔐 Security Considerations

### Client-Side Security
- Client ID is safe to expose in frontend code
- Never expose Client Secret in frontend
- All sensitive operations handled server-side

### Server-Side Security
- Validate all payments server-side
- Use webhooks for payment verification
- Store purchase records in Firebase

## 📊 Analytics Integration

PayPal payments are tracked in Firebase Analytics:
- `purchase_completed` event
- Simulator type
- Payment amount
- Payment method

## 🚨 Troubleshooting

### Common Issues

1. **"PayPal SDK failed to load"**
   - Check client ID is correct
   - Verify PayPal SDK URL
   - Check network connectivity

2. **"Payment not captured"**
   - Check PayPal app configuration
   - Verify return URLs
   - Check browser console for errors

3. **"Purchase not saved"**
   - Check Firebase configuration
   - Verify user authentication
   - Check Firestore rules

### Debug Mode
Enable debug logging by adding to console:
```javascript
localStorage.setItem('paypal-debug', 'true');
```

## 📞 Support

For PayPal-specific issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support/)

For ProfPilot integration issues:
- Check Firebase configuration
- Verify simulator parameters
- Review browser console logs

## 🔄 Updates

To update PayPal integration:
1. Update `paypal-config.js` with new settings
2. Update `paypal-integration.js` for new features
3. Test thoroughly in development
4. Deploy to production

---

**Note**: Always test payments with small amounts before going live with production credentials.