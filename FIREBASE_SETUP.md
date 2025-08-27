# Firebase Setup for ProfPilotEng

## 🔒 Security First Approach

This project uses a secure configuration system that prevents API keys from being exposed in version control.

## 📋 Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com)

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. **Project name**: `profpiloteng`
4. **Enable Google Analytics**: ❌ No (for now)
5. Click **"Create project"**

### 2. Add Web Application

1. Click the **web icon** (</>)
2. **App nickname**: `profpiloteng-web`
3. **Firebase Hosting**: ❌ No (for now)
4. Click **"Register app"**

### 3. Configure Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. **Sign-in method** tab:
   - **Email/Password**: ✅ Enable
   - **Google**: ✅ Enable
4. Click **"Save"**

### 4. Set Up Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Security rules**: Start in test mode
4. **Location**: Choose closest to your users
5. Click **"Done"**

### 5. Get Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Find your web app and click **"Config"**
5. Copy the configuration object

### 6. Update Configuration Files

#### Option A: Direct Update (Less Secure)

1. Open `firebase-config.js`
2. Replace placeholder values with your actual config:

```javascript
// Development configuration
if (isDevelopment) {
  return {
    apiKey: "your-actual-api-key",
    authDomain: "profpiloteng.firebaseapp.com",
    projectId: "profpiloteng",
    storageBucket: "profpiloteng.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  };
}
```

#### Option B: Environment Variables (More Secure)

1. Create `.env.local` file (already in .gitignore)
2. Add your configuration:

```bash
FIREBASE_API_KEY=your-actual-api-key
FIREBASE_AUTH_DOMAIN=profpiloteng.firebaseapp.com
FIREBASE_PROJECT_ID=profpiloteng
FIREBASE_STORAGE_BUCKET=profpiloteng.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. Update `firebase-config.js` to read from environment variables

### 7. Test Configuration

1. Open `login.html` in your browser
2. Check browser console for:
   - ✅ "Firebase initialized successfully for ProfPilotEng"
   - ✅ "Firebase functions initialized successfully"
3. Try to sign in with email/password or Google

## 🔐 Security Rules

### Firestore Security Rules

Update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can access their progress
      match /progress/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Authentication Settings

1. **Authorized domains**: Add your production domain
2. **Sign-in providers**: Configure email templates
3. **User management**: Set up admin roles if needed

## 🚨 Important Security Notes

- ❌ **NEVER commit real API keys to Git**
- ❌ **NEVER expose Firebase config in client-side code for production**
- ✅ **Use environment variables for production**
- ✅ **Enable Firebase App Check for additional security**
- ✅ **Set up proper Firestore security rules**
- ✅ **Monitor Firebase usage and costs**

## 🧪 Testing

### Local Development
- Use test Firebase project
- Test with dummy data
- Check console for errors

### Production Deployment
- Use production Firebase project
- Enable proper security rules
- Monitor authentication and database access

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firebase Pricing](https://firebase.google.com/pricing)

## 🆘 Troubleshooting

### Common Issues

1. **"Firebase SDK not loaded"**
   - Check script tags in HTML
   - Verify Firebase CDN links

2. **"Invalid Firebase configuration"**
   - Check `firebase-config.js` values
   - Ensure all required fields are filled

3. **Authentication errors**
   - Check Firebase Console Authentication settings
   - Verify authorized domains

4. **Database permission errors**
   - Check Firestore security rules
   - Ensure user is authenticated

### Get Help

- Check browser console for error messages
- Review Firebase Console logs
- Check [Firebase Status](https://status.firebase.google.com)

