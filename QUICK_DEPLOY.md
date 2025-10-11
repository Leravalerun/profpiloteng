# 🚀 Quick Deploy to Production

## 📁 Files to Upload

### New Files (Upload these):
- `crypto-checkout-prod.html` - Production-ready crypto checkout
- `crypto-faq.html` - Crypto payment FAQ page
- `CRYPTO_PAYMENT_GUIDE.md` - Detailed payment guide

### Updated Files (Replace existing):
- `checkout.html` - Updated to link to prod version
- `test-promo.html` - Updated references

## 🚀 Quick Deploy Commands

### Option 1: Using SCP (if you have SSH access)
```bash
# Upload new files
scp crypto-checkout-prod.html your-server:/path/to/website/
scp crypto-faq.html your-server:/path/to/website/
scp CRYPTO_PAYMENT_GUIDE.md your-server:/path/to/website/

# Update existing files
scp checkout.html your-server:/path/to/website/
scp test-promo.html your-server:/path/to/website/

# Set permissions
ssh your-server "chmod 644 /path/to/website/crypto-checkout-prod.html"
```

### Option 2: Using FTP/SFTP
1. Connect to your server via FTP/SFTP
2. Upload all files to your website directory
3. Ensure files have proper permissions (644)

### Option 3: Using cPanel File Manager
1. Login to cPanel
2. Open File Manager
3. Navigate to your website directory
4. Upload all files
5. Set permissions to 644

## 🧪 Test After Deploy

1. **Go to your production website**
2. **Navigate to checkout page**
3. **Click "Continue with Crypto"**
4. **Select any cryptocurrency**
5. **Verify payment details appear**

## ✅ Expected Results

After deployment:
- ✅ Crypto selection works immediately
- ✅ Payment details appear
- ✅ Copy address works
- ✅ Promo codes work
- ✅ FAQ page accessible
- ✅ Mobile-friendly

## 🆘 If Something Goes Wrong

### Rollback:
```bash
# Restore from backup (if you made one)
scp backup/checkout.html your-server:/path/to/website/
```

### Check:
1. File permissions (should be 644)
2. File paths are correct
3. No typos in filenames
4. Server is running

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify files are accessible directly
3. Test with different browsers
4. Contact support with specific error messages

---

**🎯 Goal**: Fix crypto payment selection on production
**✅ Result**: Users can select cryptocurrencies and see payment details
