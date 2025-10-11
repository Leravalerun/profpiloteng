#!/bin/bash

# 🚀 Simple Production Deploy Script
echo "🚀 Deploying crypto payment fix to production..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from your project root."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "🚀 Fix crypto payment selection on production

- Add crypto-checkout-prod.html (production-ready version)
- Update checkout.html to use prod version
- Add crypto-faq.html for user support
- Add CRYPTO_PAYMENT_GUIDE.md documentation
- Update test-promo.html references

Fixes: Crypto selection not working on production due to external dependencies"
    
    echo "✅ Changes committed"
else
    echo "ℹ️  No changes to commit"
fi

# Push to production branch (adjust branch name as needed)
echo "📤 Pushing to production..."
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Wait for deployment to complete"
echo "2. Test crypto payment on production"
echo "3. Verify crypto selection works"
echo "4. Check payment details appear"
echo ""
echo "🧪 Test URL: https://your-domain.com/crypto-checkout-prod.html?role=ux-designer"
