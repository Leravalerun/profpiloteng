# 🔥 Firestore Setup for Progress System

## **📋 Overview**
This document explains how to set up Firestore database rules and collections for the ProfPilot progress system.

## **🏗️ Database Structure**

### **Collections:**

#### **1. `users/{userId}/progress/simulators`**
```json
{
  "uxDesigner": {
    "level": 1,
    "experience": 0,
    "completedTasks": 0,
    "totalTasks": 10,
    "timeSpent": 0,
    "lastActivity": "timestamp",
    "achievements": [],
    "currentTask": 1
  },
  "lawyer": {
    "level": 1,
    "experience": 0,
    "completedTasks": 0,
    "totalTasks": 8,
    "timeSpent": 0,
    "lastActivity": "timestamp",
    "achievements": [],
    "currentTask": 1
  },
  "careerSimulator": {
    "level": 1,
    "experience": 0,
    "completedTasks": 0,
    "totalTasks": 12,
    "timeSpent": 0,
    "lastActivity": "timestamp",
    "achievements": [],
    "currentTask": 1
  },
  "testSimulator": {
    "level": 1,
    "experience": 0,
    "completedTasks": 0,
    "totalTasks": 6,
    "timeSpent": 0,
    "lastActivity": "timestamp",
    "achievements": [],
    "currentTask": 1
  },
  "totalLevel": 1,
  "totalExperience": 0,
  "totalTimeSpent": 0,
  "joinDate": "timestamp",
  "lastLogin": "timestamp"
}
```

#### **2. `achievements/config`**
```json
{
  "levels": {
    "beginner": {
      "min": 0,
      "max": 100,
      "title": "🥉 Beginner",
      "color": "#cd7f32"
    },
    "intermediate": {
      "min": 101,
      "max": 300,
      "title": "🥈 Intermediate",
      "color": "#c0c0c0"
    },
    "advanced": {
      "min": 301,
      "max": 600,
      "title": "🥇 Advanced",
      "color": "#ffd700"
    },
    "expert": {
      "min": 601,
      "max": 1000,
      "title": "💎 Expert",
      "color": "#b9f2ff"
    },
    "master": {
      "min": 1001,
      "max": 9999,
      "title": "👑 Master",
      "color": "#ff6b6b"
    }
  },
  "milestones": {
    "firstTask": {
      "id": "firstTask",
      "title": "🎯 First Steps",
      "description": "Complete your first task",
      "icon": "🎯"
    },
    "level5": {
      "id": "level5",
      "title": "🚀 Level 5",
      "description": "Reach level 5",
      "icon": "🚀"
    },
    "level10": {
      "id": "level10",
      "title": "🌟 Level 10",
      "description": "Reach level 10",
      "icon": "🌟"
    },
    "speedRunner": {
      "id": "speedRunner",
      "title": "⚡ Speed Runner",
      "description": "Complete 5 tasks in one day",
      "icon": "⚡"
    },
    "perfectionist": {
      "id": "perfectionist",
      "title": "✨ Perfectionist",
      "description": "Get 100% on 3 tasks",
      "icon": "✨"
    },
    "marathon": {
      "id": "marathon",
      "title": "🏃 Marathon",
      "description": "Spend 2 hours in simulators",
      "icon": "🏃"
    }
  }
}
```

## **🔒 Security Rules**

### **Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Progress subcollection
      match /progress/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Achievements are public read, admin write
    match /achievements/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin can modify achievements
    }
  }
}
```

## **🚀 Setup Steps**

### **1. Enable Firestore Database**
1. Go to Firebase Console → Your Project
2. Click "Firestore Database" in the left sidebar
3. Click "Create Database"
4. Choose "Start in test mode" (for development)
5. Select a location (choose closest to your users)

### **2. Create Collections Manually (Optional)**
The system will create collections automatically when users first access it, but you can create them manually:

1. **Create `achievements` collection**
2. **Create `achievements/config` document**
3. **Copy the achievements config JSON above**

### **3. Test the System**
1. Open `test-simulator.html` in your browser
2. Sign in with a test account
3. Complete tasks to see progress tracking
4. Check Firestore to see data being created

## **📊 Progress Calculation**

### **Level System:**
- **Level 1**: 0-99 XP
- **Level 2**: 100-199 XP
- **Level 3**: 200-299 XP
- And so on...

### **Experience Rewards:**
- **Basic Task**: 25 XP
- **Practice Task**: 35 XP
- **Advanced Task**: 50 XP
- **Expert Task**: 75 XP
- **Final Task**: 100 XP
- **Bonus Task**: 150 XP

### **Achievement Unlocks:**
- **First Steps**: Complete any first task
- **Level 5**: Reach level 5 in any simulator
- **Level 10**: Reach level 10 in any simulator
- **Marathon**: Spend 2+ hours total in simulators

## **🔧 Troubleshooting**

### **Common Issues:**

#### **1. "Permission denied" errors**
- Check if user is authenticated
- Verify Firestore rules are correct
- Ensure user ID matches document path

#### **2. Progress not saving**
- Check browser console for errors
- Verify Firebase initialization
- Check network connectivity

#### **3. Achievements not unlocking**
- Verify achievement config exists in Firestore
- Check achievement logic in `progress-manager.js`
- Ensure progress data is being saved correctly

### **Debug Mode:**
The system includes debug panels that show:
- Firebase connection status
- Authentication state
- Progress updates
- Achievement unlocks

## **📱 Testing Checklist**

- [ ] User can sign in
- [ ] Progress is saved to Firestore
- [ ] Level increases with experience
- [ ] Tasks unlock progressively
- [ ] Achievements are awarded
- [ ] Progress persists between sessions
- [ ] Dashboard shows correct stats
- [ ] Auto-logout works after 2 hours

## **🚀 Next Steps**

1. **Customize Simulators**: Add your own simulator content
2. **More Achievements**: Create industry-specific achievements
3. **Analytics**: Track user engagement and completion rates
4. **Certificates**: Generate completion certificates
5. **Social Features**: Share progress with friends

## **📞 Support**

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore rules
4. Review this documentation
5. Contact support if needed

---

**🎉 Congratulations!** Your progress system is now ready to track user learning and achievements!
