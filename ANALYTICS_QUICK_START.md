# 🚀 Quick Start: Analytics Setup

## ✅ **What's Done:**

1. **Google Analytics Measurement ID configured**: `G-XSY9VSWFB5`
2. **Analytics script added** to `index.html`
3. **Test page created**: `test-analytics.html`

## 🧪 **Testing:**

### **On Localhost (Development):**
```
http://localhost:8080/test-analytics.html
```
- Analytics will be **disabled** (as expected)
- You'll see: "Development mode - tracking disabled"
- No data will be sent to Google Analytics

### **On Production:**
```
https://www.profpilot.co/test-analytics.html
```
- Analytics will be **enabled**
- All events will be tracked
- Data will appear in your GA dashboard

## 📊 **View Your Data:**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Check **Reports** → **Realtime** to see live data
4. Check **Reports** → **Engagement** → **Events** for event data

## 🎯 **What's Being Tracked:**

### **Automatic:**
- Page views
- Button clicks
- Form submissions
- User interactions

### **To Track Custom Events:**
```javascript
// In your JavaScript code
trackEvent('simulator_started', {
    simulator: 'ux-designer',
    user_email: 'user@example.com'
});
```

## 🔍 **Key Metrics to Watch:**

1. **Traffic Sources** - Where users come from
2. **Popular Pages** - Most viewed content
3. **User Behavior** - How users navigate
4. **Conversion Funnel** - Selection → Payment → Completion
5. **Simulator Engagement** - Most popular simulators

## 📱 **Mobile Tracking:**
Analytics also tracks mobile users automatically.

## ⚠️ **Note:**
- Localhost = Development (tracking disabled)
- Production = Tracking enabled
- Data may take 24-48 hours to appear in reports
- Real-time data appears immediately

---

**Need Help?** Check `ANALYTICS_SETUP.md` for detailed documentation.
