# 💳 Payment System Setup Guide

This guide will help you set up the Stripe payment integration for ProfPilot.

## 🔧 Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com))
- Node.js installed (version 16 or higher)
- ProfPilot project files

## 📋 Step-by-Step Setup

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Note: Use test mode for development

### 2. Get Stripe API Keys

1. In your Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Keep these keys secure - never commit them to version control

### 3. Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)

### 4. Configure Environment Variables

1. Copy `env.example` to `.env`
2. Update the following values:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 5. Update Frontend Stripe Key

1. Open `checkout.html`
2. Find the line: `const stripe = Stripe('pk_test_51OZ...');`
3. Replace with your actual publishable key:

```javascript
const stripe = Stripe('pk_test_your_actual_publishable_key_here');
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🧪 Testing Payments

### Test Card Numbers

Use these test card numbers in Stripe test mode:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

### Test Flow

1. Start the server: `npm run dev`
2. Open `http://localhost:3000/checkout?role=ux-designer`
3. Use test card number: `4242 4242 4242 4242`
4. Complete the payment flow
5. Check Stripe Dashboard for the payment

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` file to version control
- Use different keys for development and production
- Rotate keys regularly

### Webhook Security
- Always verify webhook signatures
- Use HTTPS in production
- Keep webhook secrets secure

### Frontend Security
- Only use publishable keys in frontend code
- Never expose secret keys in client-side code
- Validate all payment data on the server

## 🚀 Production Deployment

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys
3. Update environment variables with live keys
4. Update frontend with live publishable key

### 2. Set Up Production Webhook

1. Create new webhook endpoint for production
2. Use your production domain
3. Update webhook secret in environment variables

### 3. Deploy to Your Platform

The server is ready to deploy to platforms like:
- Heroku
- Vercel
- Netlify Functions
- AWS Lambda
- Google Cloud Functions

## 📊 Monitoring

### Stripe Dashboard
- Monitor payments in real-time
- View failed payments and reasons
- Track revenue and analytics

### Server Logs
- Payment intent creation
- Webhook events
- Error handling

## 🛠️ Troubleshooting

### Common Issues

**Payment fails with "Invalid API key"**
- Check that you're using the correct key for your environment (test vs live)
- Ensure the key is properly set in environment variables

**Webhook not receiving events**
- Verify webhook URL is accessible
- Check webhook secret is correct
- Ensure HTTPS is used in production

**Frontend shows "Stripe not loaded"**
- Check that Stripe.js is properly loaded
- Verify publishable key is correct
- Check browser console for errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **ProfPilot Support**: careers.inspirante@gmail.com

## 🔄 Updates

Keep your Stripe integration updated:
- Monitor Stripe API changes
- Update dependencies regularly
- Test payment flows after updates

---

**Ready to process payments?** 🎉

Follow this guide step by step, and you'll have a fully functional payment system for ProfPilot!
