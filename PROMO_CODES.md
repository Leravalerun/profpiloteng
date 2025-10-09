# Promo Codes for ProfPilot

## 🎯 Overview

ProfPilot supports promo codes that can provide discounts or free access to career simulators. The system is designed to be flexible and easy to manage.

## 🔑 Current Promo Codes

### `checkppff`
- **Discount**: 100% (Free access)
- **Description**: Free access granted!
- **Status**: Active
- **Usage**: Unlimited

## 🛠️ Technical Implementation

### Configuration
Promo codes are configured in JavaScript objects:

```javascript
const PROMO_CODES = {
  'checkppff': {
    discount: 100, // 100% discount (free)
    description: 'Free access granted!'
  }
};
```

### Supported Discount Types
- **Percentage**: `discount: 50` (50% off)
- **Fixed Amount**: `discount: 15` (15% off)
- **Free Access**: `discount: 100` (100% off)

### Files Updated
- `checkout.html` - Main checkout page with promo field
- `test-promo.html` - Test page for promo functionality

## 🎨 User Experience

### Promo Code Field
- Located in the order summary section
- Input field with "Apply" button
- Real-time validation and feedback
- Disabled after successful application

### Visual Feedback
- **Success**: Green message with checkmark
- **Error**: Red message for invalid codes
- **Price Update**: Dynamic pricing with discount row
- **Free Access**: Special "Continue to Simulator" button

### Pricing Display
- Original price: $29.00
- Discount row: -$29.00 (when applicable)
- Final price: $0.00 (for free access)
- Color coding: Green for free, blue for paid

## 🔄 Workflow

### Standard Purchase
1. User selects simulator
2. User enters promo code (optional)
3. User applies promo code
4. Price updates dynamically
5. User completes payment
6. User accesses simulator

### Free Access (Promo Code)
1. User selects simulator
2. User enters valid promo code
3. User applies promo code
4. Price changes to $0.00
5. Payment methods hidden
6. "Continue to Simulator" button appears
7. User clicks continue
8. User accesses simulator for free

## 📊 Analytics

### Events Tracked
- `promo_applied` - When promo code is successfully applied
- `free_access_granted` - When free access is granted
- `purchase_completed` - When paid purchase is completed

### Data Collected
- Promo code used
- Discount percentage
- Original price
- Final price
- Simulator type
- Payment method

## 🧪 Testing

### Test Page
Use `test-promo.html` to test promo functionality:
- Links to both checkout pages
- Test instructions
- Expected behavior documentation

### Test Cases
1. **Valid Promo Code**: `checkppff` should work
2. **Invalid Promo Code**: Should show error message
3. **Empty Promo Code**: Should show validation error
4. **Free Access Flow**: Should hide payment methods
5. **Price Updates**: Should show correct pricing

## 🔧 Adding New Promo Codes

### Step 1: Update Configuration
Add new promo code to:
- `checkout.html` (line ~309)

### Step 2: Test
1. Open `test-promo.html`
2. Test the new promo code
3. Verify pricing updates correctly
4. Test free access flow (if 100% discount)

### Step 3: Deploy
1. Update checkout page
2. Test in production
3. Monitor analytics

## 📈 Analytics Dashboard

### Key Metrics
- Promo code usage rate
- Conversion rate with/without promo codes
- Most popular promo codes
- Revenue impact of promo codes

### Firebase Events
```javascript
// Promo applied
trackEvent('promo_applied', {
  promo_code: 'checkppff',
  discount: 100,
  original_price: 29.00,
  final_price: 0.00
});

// Free access granted
trackEvent('free_access_granted', {
  simulator: 'ux-designer',
  promo_code: 'checkppff',
  original_price: 29.00
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Promo code not working**
   - Check spelling (case insensitive)
   - Verify configuration in both files
   - Check browser console for errors

2. **Price not updating**
   - Check JavaScript console
   - Verify `updatePricing()` function
   - Check DOM element IDs

3. **Free access not working**
   - Check `showFreeAccessButton()` function
   - Verify Firebase integration
   - Check redirect URLs

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('promo-debug', 'true');
```

## 🔐 Security Considerations

### Client-Side Validation
- Promo codes are validated client-side
- Server-side validation recommended for production
- Rate limiting for promo code attempts

### Abuse Prevention
- Monitor for excessive promo code usage
- Implement usage limits per user
- Track and block suspicious activity

## 📞 Support

For promo code issues:
1. Check browser console for errors
2. Verify promo code configuration
3. Test with `test-promo.html`
4. Check Firebase analytics

---

**Note**: Always test promo codes thoroughly before deploying to production!

