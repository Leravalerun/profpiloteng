# PayPal Integration for ProfPilot

## 🎯 Overview

This PayPal integration allows users to purchase career simulators using PayPal or credit cards. The integration supports both development (sandbox) and production environments.

## 🚀 Quick Start

### 1. Development Setup
```bash
# Test with sandbox credentials
open test-paypal.html
```

### 2. Production Setup
1. Get production credentials from PayPal Developer Portal
2. Update `paypal-config.js` with your production client ID
3. Deploy to your domain

## 📁 Files

| File | Purpose |
|------|---------|
| `paypal-config.js` | Configuration for different environments |
| `paypal-integration.js` | Core PayPal integration logic |
| `paypal-checkout.html` | Dedicated PayPal checkout page |
| `checkout.html` | Main checkout with PayPal option |
| `test-paypal.html` | Development testing page |
| `update-paypal-credentials.js` | Script to update credentials |
| `PAYPAL_SETUP.md` | Detailed setup instructions |

## 🔧 Configuration

### Environment Detection
- **Development**: `localhost`, `127.0.0.1`, `*.netlify.app`
- **Production**: All other domains

### Pricing
- UX Designer Simulator: $29.00
- Corporate Lawyer Simulator: $29.00

## 💳 Payment Flow

1. User clicks "Start — $29" on simulator page
2. Redirected to `checkout.html`
3. User chooses "PayPal" payment method
4. Redirected to `paypal-checkout.html`
5. PayPal payment processed
6. Purchase saved to Firebase
7. User redirected to simulator

## 🧪 Testing

### Development
```bash
# Start local server
python3 -m http.server 8000

# Open test page
open http://localhost:8000/test-paypal.html
```

### Production
1. Use small amounts for testing
2. Test with real PayPal accounts
3. Verify webhook handling

## 🔐 Security

- Client ID is safe to expose in frontend
- Never expose Client Secret in frontend
- All sensitive operations handled server-side
- Payments validated server-side

## 📊 Analytics

PayPal payments are tracked in Firebase Analytics:
- `purchase_completed` event
- Simulator type
- Payment amount
- Payment method

## 🚨 Troubleshooting

### Common Issues

1. **PayPal SDK not loading**
   - Check client ID format
   - Verify network connectivity
   - Check browser console

2. **Payment not processing**
   - Verify PayPal app configuration
   - Check return URLs
   - Review error logs

3. **Purchase not saving**
   - Check Firebase configuration
   - Verify user authentication
   - Check Firestore rules

### Debug Mode
```javascript
localStorage.setItem('paypal-debug', 'true');
```

## 📞 Support

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support/)
- ProfPilot: Check Firebase and browser console

## 🔄 Updates

To update PayPal integration:
1. Update `paypal-config.js`
2. Test in development
3. Deploy to production
4. Verify payments work

---

**Note**: Always test with small amounts before going live!

