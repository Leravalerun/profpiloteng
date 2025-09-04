const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51OZ...'; // Replace with your actual key

// Simulator pricing
const SIMULATOR_PRICES = {
  'ux-designer': 1500, // $15.00 in cents
  'lawyer': 1500,      // $15.00 in cents
};

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { simulator, amount, currency = 'usd', userId, userEmail } = req.body;

    // Validate simulator
    if (!simulator || !SIMULATOR_PRICES[simulator]) {
      return res.status(400).json({ error: 'Invalid simulator' });
    }

    // Validate amount
    const expectedAmount = SIMULATOR_PRICES[simulator];
    if (amount !== expectedAmount) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: {
        simulator: simulator,
        userId: userId || 'anonymous',
        userEmail: userEmail || 'unknown'
      },
      description: `ProfPilot ${simulator} Simulator`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Here you could save the purchase to your database
      // For now, we'll just log it
      console.log('Purchase details:', {
        simulator: paymentIntent.metadata.simulator,
        userId: paymentIntent.metadata.userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      });
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ProfPilot server running on port ${PORT}`);
  console.log(`💳 Stripe integration enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
