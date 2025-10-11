#!/bin/bash

# 🚀 Production Fix Deployment Script
# This script deploys the crypto payment fix to production

echo "🚀 Starting Production Fix Deployment..."

# Configuration - UPDATE THESE VALUES FOR YOUR SERVER
SERVER_HOST="your-server.com"
SERVER_USER="your-username"
SERVER_PATH="/path/to/website"
BACKUP_DIR="/path/to/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
print_status "Checking required files..."

REQUIRED_FILES=(
    "crypto-checkout-prod.html"
    "checkout.html"
    "test-promo.html"
    "crypto-faq.html"
    "CRYPTO_PAYMENT_GUIDE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file not found!"
        exit 1
    fi
    print_success "Found $file"
done

# Create backup directory on server
print_status "Creating backup directory on server..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"

# Backup existing files
print_status "Backing up existing files..."
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ssh $SERVER_USER@$SERVER_HOST "
    mkdir -p $BACKUP_DIR/$BACKUP_TIMESTAMP
    cp $SERVER_PATH/checkout.html $BACKUP_DIR/$BACKUP_TIMESTAMP/ 2>/dev/null || true
    cp $SERVER_PATH/test-promo.html $BACKUP_DIR/$BACKUP_TIMESTAMP/ 2>/dev/null || true
    echo 'Backup created at $BACKUP_DIR/$BACKUP_TIMESTAMP'
"

# Upload new production-ready crypto checkout
print_status "Uploading crypto-checkout-prod.html..."
scp crypto-checkout-prod.html $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -eq 0 ]; then
    print_success "crypto-checkout-prod.html uploaded successfully"
else
    print_error "Failed to upload crypto-checkout-prod.html"
    exit 1
fi

# Upload updated checkout.html
print_status "Uploading updated checkout.html..."
scp checkout.html $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -eq 0 ]; then
    print_success "checkout.html updated successfully"
else
    print_error "Failed to upload checkout.html"
    exit 1
fi

# Upload updated test-promo.html
print_status "Uploading updated test-promo.html..."
scp test-promo.html $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -eq 0 ]; then
    print_success "test-promo.html updated successfully"
else
    print_error "Failed to upload test-promo.html"
    exit 1
fi

# Upload crypto FAQ page
print_status "Uploading crypto-faq.html..."
scp crypto-faq.html $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -eq 0 ]; then
    print_success "crypto-faq.html uploaded successfully"
else
    print_error "Failed to upload crypto-faq.html"
    exit 1
fi

# Upload crypto payment guide
print_status "Uploading CRYPTO_PAYMENT_GUIDE.md..."
scp CRYPTO_PAYMENT_GUIDE.md $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
if [ $? -eq 0 ]; then
    print_success "CRYPTO_PAYMENT_GUIDE.md uploaded successfully"
else
    print_error "Failed to upload CRYPTO_PAYMENT_GUIDE.md"
    exit 1
fi

# Set proper permissions
print_status "Setting file permissions..."
ssh $SERVER_USER@$SERVER_HOST "
    chmod 644 $SERVER_PATH/crypto-checkout-prod.html
    chmod 644 $SERVER_PATH/checkout.html
    chmod 644 $SERVER_PATH/test-promo.html
    chmod 644 $SERVER_PATH/crypto-faq.html
    chmod 644 $SERVER_PATH/CRYPTO_PAYMENT_GUIDE.md
    echo 'File permissions set successfully'
"

# Verify files are accessible
print_status "Verifying file accessibility..."
ssh $SERVER_USER@$SERVER_HOST "
    ls -la $SERVER_PATH/crypto-checkout-prod.html
    ls -la $SERVER_PATH/checkout.html
    ls -la $SERVER_PATH/test-promo.html
    ls -la $SERVER_PATH/crypto-faq.html
    ls -la $SERVER_PATH/CRYPTO_PAYMENT_GUIDE.md
"

print_success "🎉 Deployment completed successfully!"
print_status "📋 Next steps:"
echo "1. Test the crypto payment flow on production"
echo "2. Verify crypto selection works"
echo "3. Check payment details appear"
echo "4. Test promo codes"
echo "5. Verify mobile compatibility"

print_warning "⚠️  Remember to:"
echo "- Clear any CDN cache if you're using one"
echo "- Test with different browsers"
echo "- Check mobile devices"

echo ""
print_success "🚀 Production fix is now live!"
