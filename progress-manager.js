// Progress Manager for ProfPilot Simulators
// Handles user progress, achievements, and statistics

class ProgressManager {
  constructor() {
    console.log('🏗️ ProgressManager constructor called');
    try {
      this.db = firebase.firestore();
      console.log('✅ Firestore initialized');
      this.auth = firebase.auth();
      console.log('✅ Auth initialized');
      this.currentUser = null;
      this.progressData = null;
      this.achievements = null;
      
      // Initialize when Firebase is ready
      this.init();
    } catch (error) {
      console.error('❌ Error in ProgressManager constructor:', error);
    }
  }
  
  async init() {
    try {
      // Wait for Firebase to be ready
      if (firebase.apps.length === 0) {
        await new Promise(resolve => {
          const checkFirebase = () => {
            if (firebase.apps.length > 0) {
              resolve();
            } else {
              setTimeout(checkFirebase, 100);
            }
          };
          checkFirebase();
        });
      }
      
      // Listen for auth state changes
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.currentUser = user;
          await this.loadUserProgress();
          await this.loadAchievements();
          console.log('✅ Progress manager initialized for user:', user.email);
        } else {
          this.currentUser = null;
          this.progressData = null;
          this.achievements = null;
        }
      });
      
    } catch (error) {
      console.error('❌ Error initializing progress manager:', error);
    }
  }
  
  // Load user progress from Firestore
  async loadUserProgress() {
    if (!this.currentUser) return;
    
    try {
      const doc = await this.db.collection('users')
        .doc(this.currentUser.uid)
        .collection('progress')
        .doc('simulators')
        .get();
      
      if (doc.exists) {
        this.progressData = doc.data();
        console.log('📊 Loaded user progress:', this.progressData);
      } else {
        // Initialize new user progress
        this.progressData = this.getDefaultProgress();
        await this.saveUserProgress();
        console.log('🆕 Initialized new user progress');
      }
    } catch (error) {
      console.error('❌ Error loading user progress:', error);
      this.progressData = this.getDefaultProgress();
    }
  }
  
  // Load achievements configuration
  async loadAchievements() {
    try {
      const doc = await this.db.collection('achievements').doc('config').get();
      if (doc.exists) {
        this.achievements = doc.data();
      } else {
        // Initialize default achievements
        this.achievements = this.getDefaultAchievements();
        await this.saveAchievements();
      }
      console.log('🏆 Loaded achievements:', this.achievements);
    } catch (error) {
      console.error('❌ Error loading achievements:', error);
      this.achievements = this.getDefaultAchievements();
    }
  }
  
  // Get default progress structure
  getDefaultProgress() {
    return {
      uxDesigner: {
        level: 1,
        experience: 0,
        completedTasks: 0,
        totalTasks: 10,
        timeSpent: 0,
        lastActivity: null,
        achievements: [],
        currentTask: 1
      },
      lawyer: {
        level: 1,
        experience: 0,
        completedTasks: 0,
        totalTasks: 8,
        timeSpent: 0,
        lastActivity: null,
        achievements: [],
        currentTask: 1
      },
      careerSimulator: {
        level: 1,
        experience: 0,
        completedTasks: 0,
        totalTasks: 12,
        timeSpent: 0,
        lastActivity: null,
        achievements: [],
        currentTask: 1
      },
      testSimulator: {
        level: 1,
        experience: 0,
        completedTasks: 0,
        totalTasks: 6,
        timeSpent: 0,
        lastActivity: null,
        achievements: [],
        currentTask: 1
      },
      totalLevel: 1,
      totalExperience: 0,
      totalTimeSpent: 0,
      joinDate: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    };
  }
  
  // Get default achievements
  getDefaultAchievements() {
    return {
      levels: {
        beginner: { min: 0, max: 100, title: '🥉 Beginner', color: '#cd7f32' },
        intermediate: { min: 101, max: 300, title: '🥈 Intermediate', color: '#c0c0c0' },
        advanced: { min: 301, max: 600, title: '🥇 Advanced', color: '#ffd700' },
        expert: { min: 601, max: 1000, title: '💎 Expert', color: '#b9f2ff' },
        master: { min: 1001, max: 9999, title: '👑 Master', color: '#ff6b6b' }
      },
      milestones: {
        firstTask: { id: 'firstTask', title: '🎯 First Steps', description: 'Complete your first task', icon: '🎯' },
        level5: { id: 'level5', title: '🚀 Level 5', description: 'Reach level 5', icon: '🚀' },
        level10: { id: 'level10', title: '🌟 Level 10', description: 'Reach level 10', icon: '🌟' },
        speedRunner: { id: 'speedRunner', title: '⚡ Speed Runner', description: 'Complete 5 tasks in one day', icon: '⚡' },
        perfectionist: { id: 'perfectionist', title: '✨ Perfectionist', description: 'Get 100% on 3 tasks', icon: '✨' },
        marathon: { id: 'marathon', title: '🏃 Marathon', description: 'Spend 2 hours in simulators', icon: '🏃' }
      }
    };
  }
  
  // Save user progress to Firestore
  async saveUserProgress() {
    if (!this.currentUser || !this.progressData) return;
    
    try {
      await this.db.collection('users')
        .doc(this.currentUser.uid)
        .collection('progress')
        .doc('simulators')
        .set(this.progressData);
      
      console.log('💾 Progress saved successfully');
    } catch (error) {
      console.error('❌ Error saving progress:', error);
    }
  }
  
  // Save achievements configuration
  async saveAchievements() {
    try {
      await this.db.collection('achievements').doc('config').set(this.achievements);
      console.log('💾 Achievements saved successfully');
    } catch (error) {
      console.error('❌ Error saving achievements:', error);
    }
  }
  
  // Update simulator progress
  async updateSimulatorProgress(simulatorName, taskData) {
    if (!this.currentUser || !this.progressData) return;
    
    const simulator = this.progressData[simulatorName];
    if (!simulator) return;
    
    // Update progress
    simulator.completedTasks++;
    simulator.experience += taskData.experience || 10;
    simulator.timeSpent += taskData.timeSpent || 0;
    simulator.lastActivity = firebase.firestore.FieldValue.serverTimestamp();
    simulator.currentTask = Math.min(simulator.currentTask + 1, simulator.totalTasks);
    
    // Calculate new level
    const newLevel = Math.floor(simulator.experience / 100) + 1;
    if (newLevel > simulator.level) {
      simulator.level = newLevel;
      this.showLevelUpNotification(simulatorName, newLevel);
    }
    
    // Update totals
    this.progressData.totalExperience = Object.values(this.progressData)
      .filter(item => typeof item === 'object' && item.experience !== undefined)
      .reduce((sum, item) => sum + item.experience, 0);
    
    this.progressData.totalLevel = Math.floor(this.progressData.totalExperience / 100) + 1;
    this.progressData.totalTimeSpent = Object.values(this.progressData)
      .filter(item => typeof item === 'object' && item.timeSpent !== undefined)
      .reduce((sum, item) => sum + item.timeSpent, 0);
    
    // Check for achievements
    await this.checkAchievements(simulatorName, taskData);
    
    // Save progress
    await this.saveUserProgress();
    
    console.log(`📊 Updated ${simulatorName} progress:`, simulator);
  }
  
  // Check for new achievements
  async checkAchievements(simulatorName, taskData) {
    const newAchievements = [];
    
    // Check level-based achievements
    if (this.progressData[simulatorName].level >= 5 && 
        !this.progressData[simulatorName].achievements.includes('level5')) {
      newAchievements.push('level5');
    }
    
    if (this.progressData[simulatorName].level >= 10 && 
        !this.progressData[simulatorName].achievements.includes('level10')) {
      newAchievements.push('level10');
    }
    
    // Check first task achievement
    if (this.progressData[simulatorName].completedTasks === 1 && 
        !this.progressData[simulatorName].achievements.includes('firstTask')) {
      newAchievements.push('firstTask');
    }
    
    // Check time-based achievements
    if (this.progressData.totalTimeSpent >= 7200 && // 2 hours
        !this.progressData[simulatorName].achievements.includes('marathon')) {
      newAchievements.push('marathon');
    }
    
    // Add new achievements
    if (newAchievements.length > 0) {
      this.progressData[simulatorName].achievements.push(...newAchievements);
      this.showAchievementNotification(newAchievements);
    }
  }
  
  // Show level up notification
  showLevelUpNotification(simulatorName, level) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 16px;
      z-index: 10000;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      animation: levelUp 0.6s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h2 style="margin: 0 0 8px 0; font-size: 24px;">Level Up!</h2>
      <p style="margin: 0; font-size: 18px;">${simulatorName} reached level ${level}</p>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes levelUp {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }
  
  // Show achievement notification
  showAchievementNotification(achievements) {
    achievements.forEach(achievementId => {
      const achievement = this.achievements.milestones[achievementId];
      if (!achievement) return;
      
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        animation: slideIn 0.5s ease-out;
      `;
      
      notification.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 12px;">${achievement.icon}</div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px;">${achievement.title}</h3>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">${achievement.description}</p>
      `;
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.remove();
        style.remove();
      }, 4000);
    });
  }
  
  // Get user statistics
  getStatistics() {
    if (!this.progressData) return null;
    
    return {
      totalLevel: this.progressData.totalLevel,
      totalExperience: this.progressData.totalExperience,
      totalTimeSpent: this.progressData.totalTimeSpent,
      simulators: {
        uxDesigner: this.progressData.uxDesigner,
        lawyer: this.progressData.lawyer,
        careerSimulator: this.progressData.careerSimulator
      }
    };
  }
  
  // Get achievement progress
  getAchievementProgress() {
    if (!this.progressData || !this.achievements) return null;
    
    const totalAchievements = Object.keys(this.achievements.milestones).length;
    const unlockedAchievements = new Set();
    
    Object.values(this.progressData).forEach(simulator => {
      if (simulator.achievements) {
        simulator.achievements.forEach(achievement => {
          unlockedAchievements.add(achievement);
        });
      }
    });
    
    return {
      unlocked: unlockedAchievements.size,
      total: totalAchievements,
      percentage: Math.round((unlockedAchievements.size / totalAchievements) * 100)
    };
  }
}

// Initialize progress manager when Firebase is ready
let progressManager;
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded fired in progress-manager.js');
  // Wait for Firebase to be ready
  const initProgress = () => {
    console.log('⏳ Checking Firebase availability...');
    console.log('Firebase apps length:', firebase.apps.length);
    console.log('Firebase auth available:', !!firebase.auth);
    
    if (firebase.apps.length > 0 && firebase.auth) {
      console.log('✅ Firebase ready, creating ProgressManager...');
      try {
        progressManager = new ProgressManager();
        console.log('✅ ProgressManager created successfully');
        // Make it globally available
        window.progressManager = progressManager;
        console.log('✅ ProgressManager assigned to window.progressManager');
      } catch (error) {
        console.error('❌ Error creating ProgressManager:', error);
      }
    } else {
      console.log('⏳ Firebase not ready yet, waiting...');
      setTimeout(initProgress, 100);
    }
  };
  initProgress();
});

// Export for use in other files
window.ProgressManager = ProgressManager;
window.progressManager = progressManager;
