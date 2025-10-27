# 📊 Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your ProfPilot website.

## 🔧 Setup Instructions

### **1. Get Your Google Analytics 4 Measurement ID**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Go to **Admin** → **Data Streams**
4. Click **Web**
5. Enter your website URL
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### **2. Configure Analytics**

1. Open `analytics.js`
2. Replace `G-XXXXXXXXXX` with your actual Measurement ID:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID-HERE';
   ```

### **3. Test Analytics**

1. Open your website in the browser
2. Open **Developer Tools** (F12)
3. Check the **Console** tab
4. You should see:
   - ✅ "Analytics: Initialized successfully" (production)
   - 🔧 "Analytics: Development mode - tracking disabled" (localhost)

## 🎯 Tracking Events

### **Automatic Tracking**
Analytics automatically tracks:
- Page views
- User interactions
- Button clicks
- Form submissions

### **Manual Event Tracking**

You can track custom events in your code:

```javascript
// Track a button click
trackEvent('button_click', {
    button_name: 'Start Simulator',
    simulator: 'ux-designer'
});

// Track a purchase
trackEvent('purchase', {
    simulator: 'lawyer',
    price: 29.00,
    payment_method: 'crypto'
});

// Track page view
trackEvent('page_view', {
    page_title: 'Simulator Selection'
});
```

## 📈 Key Metrics to Track

### **User Engagement**
- Number of visitors
- Page views
- Average session duration
- Bounce rate

### **Conversion Funnel**
- Simulator selection → Checkout → Payment → Simulator start
- Promo code usage
- Email collection

### **Content Performance**
- Most popular simulators
- Blog post views
- Time spent on each page

### **Technical Metrics**
- Page load times
- Error rates
- Browser/device breakdown

## 🔍 Events Already Tracked

The following events are already set up:

### **Simulator Events**
- `simulator_started` - When user begins a simulator
- `simulator_completed` - When user finishes a simulator
- `question_answered` - When user answers a question
- `feedback_received` - When user receives feedback

### **Purchase Events**
- `checkout_started` - When user begins checkout
- `payment_initiated` - When user starts payment
- `payment_completed` - When payment is successful
- `promo_code_applied` - When user applies a promo code

### **Navigation Events**
- `simulator_selected` - When user clicks on a simulator
- `learn_more_clicked` - When user clicks "Learn more"
- `start_for_29_clicked` - When user clicks pricing button

## 🚀 Production vs Development

### **Development Mode (localhost)**
- Tracking is **disabled** by default
- No data is sent to Google Analytics
- Console logs indicate development mode

### **Production Mode (profpilot.co)**
- Tracking is **enabled**
- All events are sent to Google Analytics
- Data appears in your GA dashboard

## 📊 Viewing Your Analytics Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Engagement** → **Events**
4. See real-time data: **Reports** → **Realtime**

## 🔒 Privacy Considerations

- **Anonymize IP**: Enabled for privacy compliance
- **Cookie Policy**: Mentioned in your Privacy Policy
- **GDPR**: GA4 is GDPR compliant by default
- **Do Not Track**: Considered in tracking logic

## ⚙️ Advanced Configuration

### **Enable Enhanced Measurements**
In Google Analytics dashboard:
1. Go to **Admin** → **Data Streams** → Your stream
2. Enable:
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

### **Custom Dimensions**
Track custom user attributes:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
    custom_map: {
        'dimension1': 'simulator_type',
        'dimension2': 'user_experience_level'
    }
});
```

### **Goals and Conversions**
Set up conversion goals in Google Analytics:
1. **Admin** → **Goals**
2. Create new goals for:
   - Simulator completion
   - Payment completion
   - Email signup

## 🛠️ Troubleshooting

### **Analytics not working?**
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Check if ad blockers are blocking GA
4. Verify script is loaded: `console.log(typeof gtag)`

### **Events not appearing?**
1. Check if you're in development mode
2. Verify event names are correct
3. Wait up to 24 hours for data to appear
4. Check Realtime view for immediate results

### **Privacy errors?**
1. Ensure `anonymize_ip: true` is set
2. Update your Privacy Policy
3. Add cookie consent if required

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Tracking](https://support.google.com/analytics/answer/9267735)
- [GDPR Compliance](https://support.google.com/analytics/answer/9019185)

---

**Need Help?** Contact support or check the console for detailed logs.
