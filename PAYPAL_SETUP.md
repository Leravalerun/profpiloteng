# PayPal Integration Setup

## 1. Create PayPal Developer Account

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Sign in with your PayPal account or create one
3. Navigate to "My Apps & Credentials"

## 2. Create New App

1. Click "Create App"
2. Choose "Default Application" or "Custom App"
3. Select "Sandbox" for testing or "Live" for production
4. Note down your **Client ID**

## 3. Update checkout.html

Replace `YOUR_PAYPAL_CLIENT_ID` in the PayPal SDK script with your actual Client ID:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_ACTUAL_CLIENT_ID&currency=USD&intent=capture"></script>
```

## 4. Test the Integration

### Sandbox Testing
1. Use sandbox test accounts from PayPal Developer Portal
2. Test with different scenarios (success, failure, cancellation)
3. Verify payments appear in your PayPal sandbox account

### Production Testing
1. Switch to live credentials
2. Test with real PayPal accounts
3. Monitor transactions in your PayPal business account

## 5. Webhook Setup (Optional)

For advanced features, set up webhooks:

1. In PayPal Developer Portal, go to your app
2. Click "Webhooks" tab
3. Add webhook URL: `https://yourdomain.com/paypal-webhook`
4. Select events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`

## 6. Environment Variables

Create a `.env` file for production:

```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
```

## 7. Security Considerations

- Never expose your Client Secret in frontend code
- Use HTTPS in production
- Validate webhook signatures
- Implement proper error handling
- Log all payment attempts

## 8. Testing Checklist

- [ ] Payment flow works end-to-end
- [ ] Success redirects to correct simulator
- [ ] Error handling works properly
- [ ] Firebase purchase data is saved
- [ ] User gets access to simulator after payment
- [ ] Mobile responsive design works
- [ ] Different simulators work correctly

## 9. Production Deployment

1. Update Client ID to live credentials
2. Test with real PayPal accounts
3. Monitor PayPal dashboard for transactions
4. Set up proper logging and monitoring
5. Configure backup payment methods if needed

## Support

For PayPal integration issues:
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/us/smarthelp/contact-us)
