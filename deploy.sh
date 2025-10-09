#!/bin/bash

# ProfPilot Deployment Script
# This script helps deploy the project to production

echo "🚀 ProfPilot Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project files found"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run 'git init' first."
    exit 1
fi

echo "✅ Git repository found"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes."
    echo "Files with changes:"
    git status --porcelain
    echo ""
    read -p "Do you want to commit these changes before deploying? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "Deploy: Update project files $(date '+%Y-%m-%d %H:%M:%S')"
        echo "✅ Changes committed"
    else
        echo "⚠️  Deploying with uncommitted changes..."
    fi
fi

# Check if we're on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch."
    read -p "Do you want to switch to main branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        echo "✅ Switched to main branch"
    fi
fi

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to remote repository"
    echo ""
    echo "🎉 Deployment initiated!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check your Netlify dashboard for deployment status"
    echo "2. Verify the site is working at your domain"
    echo "3. Test all payment methods:"
    echo "   - Crypto payments"
    echo "   - Promo code 'checkppff'"
    echo ""
    echo "🔧 Configuration needed:"
    echo "1. Update crypto addresses in crypto-config.js"
    echo "2. Update crypto payment configuration"
    echo "3. Verify Firebase configuration"
    echo ""
    echo "📊 Monitoring:"
    echo "- Check Firebase Analytics"
    echo "- Monitor payment success rates"
    echo "- Watch for any errors in browser console"
else
    echo "❌ Failed to push to remote repository"
    echo "Please check your git configuration and try again."
    exit 1
fi
