/**
 * 🎮 Simulator Game Engine
 * 
 * Добавляет игровые механики в симуляторы:
 * - XP система
 * - Звезды за задачи
 * - Бейджи и достижения
 * - Визуальные эффекты
 * - Прогресс-бары
 */

class SimulatorGameEngine {
  constructor(config = {}) {
    this.xp = config.startXP || 0;
    this.level = config.startLevel || 1;
    this.achievements = new Set(config.achievements || []);
    this.taskStars = config.taskStars || {}; // {taskId: stars}
    this.totalStars = 0;
    this.completedTasks = new Set(config.completedTasks || []);
    
    // XP для уровней (каждый уровень требует больше XP)
    this.xpPerLevel = config.xpPerLevel || 500;
    
    // Достижения конфигурация
    this.achievementsConfig = {
      'first_task': {
        name: 'First Steps',
        description: 'Completed your first task!',
        icon: '🎯',
        xpReward: 50
      },
      'three_stars': {
        name: 'Perfectionist',
        description: 'Got 3 stars on a task!',
        icon: '⭐',
        xpReward: 100
      },
      'all_three_stars': {
        name: 'Master',
        description: 'Got 3 stars on all tasks!',
        icon: '👑',
        xpReward: 200
      },
      'day_complete': {
        name: 'Day Complete',
        description: 'Completed a full day!',
        icon: '📅',
        xpReward: 150
      },
      'speed_runner': {
        name: 'Speed Runner',
        description: 'Completed a day in under 15 minutes!',
        icon: '⚡',
        xpReward: 100
      },
      'dedicated': {
        name: 'Dedicated',
        description: 'Completed 10 tasks!',
        icon: '🔥',
        xpReward: 150
      }
    };
    
    // Время начала дня (для speed runner)
    this.dayStartTime = null;
    
    this.init();
  }
  
  init() {
    console.log('🎮 Game Engine initialized');
    this.updateTotalStars();
    this.renderUI();
  }
  
  // Добавить XP с анимацией
  addXP(amount, reason = '') {
    const oldXP = this.xp;
    const oldLevel = this.level;
    
    this.xp += amount;
    
    // Проверить уровень
    this.level = this.calculateLevel(this.xp);
    
    // Анимация счетчика XP
    this.animateCounter('game-xp-value', oldXP, this.xp);
    
    // Показать визуальный эффект
    this.showXPGain(amount, reason);
    
    // Проверить повышение уровня
    if (this.level > oldLevel) {
      this.levelUp(this.level);
    }
    
    // Обновить UI
    this.updateProgressBar();
    
    // Сохранить прогресс
    this.saveProgress();
  }
  
  // Оценить задачу (1-3 звезды)
  rateTask(taskId, stars, feedback = '') {
    const oldStars = this.taskStars[taskId] || 0;
    
    // Обновить только если новый результат лучше
    if (stars > oldStars) {
      this.taskStars[taskId] = stars;
      this.updateTotalStars();
      
      // Показать звезды с анимацией
      this.showStars(taskId, stars);
      
      // Добавить XP в зависимости от звезд
      const xpGain = stars * 20; // 20 XP за звезду
      this.addXP(xpGain, `Task ${taskId}: ${stars} stars`);
      
      // Проверить достижения
      this.checkAchievements();
      
      // Показать обратную связь
      if (feedback) {
        this.showFeedback(feedback, stars === 3 ? 'success' : 'info');
      }
      
      // Сохранить прогресс
      this.saveProgress();
      
      return true; // Новый рекорд
    }
    
    return false; // Не улучшили результат
  }
  
  // Показать звезды с анимацией
  showStars(taskId, stars) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    // Найти или создать контейнер для звезд
    let starsContainer = taskElement.querySelector('.task-stars');
    if (!starsContainer) {
      starsContainer = document.createElement('div');
      starsContainer.className = 'task-stars flex gap-1 mt-2';
      taskElement.appendChild(starsContainer);
    }
    
    starsContainer.innerHTML = '';
    
    // Анимированное появление звезд
    for (let i = 0; i < 3; i++) {
      const star = document.createElement('span');
      star.className = `text-2xl ${i < stars ? 'text-yellow-400' : 'text-slate-300'}`;
      star.textContent = '⭐';
      star.style.opacity = '0';
      star.style.transform = 'scale(0)';
      starsContainer.appendChild(star);
      
      // Анимация появления
      setTimeout(() => {
        star.style.transition = 'all 0.3s ease';
        star.style.opacity = '1';
        star.style.transform = 'scale(1)';
        
        if (i < stars) {
          // Эффект пульсации для полученных звезд
          star.style.animation = 'pulse 0.5s ease';
        }
      }, i * 150);
    }
    
    // Если 3 звезды - confetti
    if (stars === 3) {
      this.showConfetti();
    }
  }
  
  // Показать получение XP
  showXPGain(amount, reason = '') {
    const xpGain = document.createElement('div');
    xpGain.className = 'xp-gain fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    xpGain.style.opacity = '0';
    xpGain.style.transform = 'translateY(-20px)';
    xpGain.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold">+${amount} XP</span>
        ${reason ? `<span class="text-sm">${reason}</span>` : ''}
      </div>
    `;
    
    document.body.appendChild(xpGain);
    
    // Анимация появления
    setTimeout(() => {
      xpGain.style.transition = 'all 0.3s ease';
      xpGain.style.opacity = '1';
      xpGain.style.transform = 'translateY(0)';
    }, 10);
    
    // Удалить через 2 секунды
    setTimeout(() => {
      xpGain.style.transition = 'all 0.3s ease';
      xpGain.style.opacity = '0';
      xpGain.style.transform = 'translateY(-20px)';
      setTimeout(() => xpGain.remove(), 300);
    }, 2000);
  }
  
  // Разблокировать достижение
  unlockAchievement(id) {
    if (this.achievements.has(id)) {
      return false; // Уже разблокировано
    }
    
    const achievement = this.achievementsConfig[id];
    if (!achievement) {
      console.warn(`Achievement ${id} not found in config`);
      return false;
    }
    
    this.achievements.add(id);
    
    // Показать уведомление
    this.showAchievement(achievement);
    
    // Бонус XP
    if (achievement.xpReward) {
      this.addXP(achievement.xpReward, `Achievement: ${achievement.name}`);
    }
    
    // Сохранить прогресс
    this.saveProgress();
    
    return true;
  }
  
  // Показать достижение
  showAchievement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'achievement-notification fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-2xl z-50 max-w-md';
    achievementDiv.style.opacity = '0';
    achievementDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
    achievementDiv.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-4">${achievement.icon}</div>
        <h3 class="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
        <p class="text-xl font-semibold mb-1">${achievement.name}</p>
        <p class="text-sm opacity-90">${achievement.description}</p>
      </div>
    `;
    
    document.body.appendChild(achievementDiv);
    
    // Анимация появления
    setTimeout(() => {
      achievementDiv.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      achievementDiv.style.opacity = '1';
      achievementDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Confetti
    this.showConfetti();
    
    // Удалить через 4 секунды
    setTimeout(() => {
      achievementDiv.style.transition = 'all 0.3s ease';
      achievementDiv.style.opacity = '0';
      achievementDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => achievementDiv.remove(), 300);
    }, 4000);
  }
  
  // Проверить достижения
  checkAchievements() {
    const taskCount = Object.keys(this.taskStars).length;
    const allThreeStars = Object.values(this.taskStars).every(s => s === 3);
    const hasThreeStars = Object.values(this.taskStars).some(s => s === 3);
    
    // Первая задача
    if (taskCount === 1 && !this.achievements.has('first_task')) {
      this.unlockAchievement('first_task');
    }
    
    // 3 звезды на задаче
    if (hasThreeStars && !this.achievements.has('three_stars')) {
      this.unlockAchievement('three_stars');
    }
    
    // Все 3 звезды (минимум 3 задачи)
    if (allThreeStars && taskCount >= 3 && !this.achievements.has('all_three_stars')) {
      this.unlockAchievement('all_three_stars');
    }
    
    // 10 задач
    if (taskCount >= 10 && !this.achievements.has('dedicated')) {
      this.unlockAchievement('dedicated');
    }
  }
  
  // Завершить день
  completeDay(dayNumber) {
    this.completedTasks.add(`day_${dayNumber}`);
    
    // Бонус XP за завершение дня
    this.addXP(150, `Day ${dayNumber} Complete`);
    
    // Проверить speed runner
    if (this.dayStartTime) {
      const timeSpent = (Date.now() - this.dayStartTime) / 1000 / 60; // минуты
      if (timeSpent < 15 && !this.achievements.has('speed_runner')) {
        this.unlockAchievement('speed_runner');
      }
    }
    
    // Разблокировать достижение
    this.unlockAchievement('day_complete');
    
    // Confetti
    this.showConfetti();
    
    // Сохранить прогресс
    this.saveProgress();
  }
  
  // Начать день (для speed runner)
  startDay() {
    this.dayStartTime = Date.now();
  }
  
  // Вычислить уровень на основе XP
  calculateLevel(xp) {
    return Math.floor(xp / this.xpPerLevel) + 1;
  }
  
  // Повышение уровня
  levelUp(newLevel) {
    const levelUpDiv = document.createElement('div');
    levelUpDiv.className = 'level-up fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-2xl shadow-2xl z-50 text-center';
    levelUpDiv.style.opacity = '0';
    levelUpDiv.style.transform = 'translate(-50%, -50%) scale(0.5)';
    levelUpDiv.innerHTML = `
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-4xl font-bold mb-2">Level Up!</h2>
      <p class="text-2xl">You reached Level ${newLevel}!</p>
    `;
    
    document.body.appendChild(levelUpDiv);
    
    // Анимация
    setTimeout(() => {
      levelUpDiv.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      levelUpDiv.style.opacity = '1';
      levelUpDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Confetti
    this.showConfetti();
    
    // Удалить через 3 секунды
    setTimeout(() => {
      levelUpDiv.style.transition = 'all 0.3s ease';
      levelUpDiv.style.opacity = '0';
      levelUpDiv.style.transform = 'translate(-50%, -50%) scale(0.5)';
      setTimeout(() => levelUpDiv.remove(), 300);
    }, 3000);
  }
  
  // Обновить общее количество звезд
  updateTotalStars() {
    this.totalStars = Object.values(this.taskStars)
      .reduce((sum, stars) => sum + stars, 0);
  }
  
  // Анимация счетчика
  animateCounter(elementId, from, to) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000; // 1 секунда
    const steps = 30;
    const stepValue = (to - from) / steps;
    const stepTime = duration / steps;
    
    let current = from;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += stepValue;
      
      if (step >= steps) {
        current = to;
        clearInterval(timer);
      }
      
      element.textContent = Math.floor(current);
    }, stepTime);
  }
  
  // Показать confetti эффект
  showConfetti() {
    // Простая реализация confetti
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        z-index: 9999;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      `;
      
      document.body.appendChild(confetti);
      
      // Анимация падения
      const duration = 2000 + Math.random() * 1000;
      const xMovement = (Math.random() - 0.5) * 200;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${xMovement}px, ${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
      }).onfinish = () => confetti.remove();
    }
  }
  
  // Показать обратную связь
  showFeedback(message, type = 'info') {
    const feedbackDiv = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-amber-500'
    };
    
    feedbackDiv.className = `feedback-message fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md`;
    feedbackDiv.style.opacity = '0';
    feedbackDiv.style.transform = 'translateY(20px)';
    feedbackDiv.textContent = message;
    
    document.body.appendChild(feedbackDiv);
    
    // Анимация появления
    setTimeout(() => {
      feedbackDiv.style.transition = 'all 0.3s ease';
      feedbackDiv.style.opacity = '1';
      feedbackDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Удалить через 3 секунды
    setTimeout(() => {
      feedbackDiv.style.transition = 'all 0.3s ease';
      feedbackDiv.style.opacity = '0';
      feedbackDiv.style.transform = 'translateY(20px)';
      setTimeout(() => feedbackDiv.remove(), 300);
    }, 3000);
  }
  
  // Обновить прогресс-бар
  updateProgressBar() {
    const currentLevelXP = this.xp % this.xpPerLevel;
    const percent = (currentLevelXP / this.xpPerLevel) * 100;
    
    const progressBar = document.getElementById('game-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }
  
  // Рендерить UI
  renderUI() {
    // Создать игровой UI в header
    const header = document.querySelector('header');
    if (!header) return;
    
    // Проверить, не создан ли уже
    if (document.getElementById('game-ui')) {
      return;
    }
    
    const gameUI = document.createElement('div');
    gameUI.id = 'game-ui';
    gameUI.className = 'game-ui bg-white border-b border-slate-200 py-3';
    gameUI.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600">Level</span>
            <span id="game-level" class="text-xl font-bold text-slate-900">${this.level}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600">XP</span>
            <span id="game-xp-value" class="text-xl font-bold text-blue-600">${this.xp}</span>
          </div>
          <div class="w-32 bg-slate-200 rounded-full h-2">
            <div id="game-progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${(this.xp % this.xpPerLevel) / this.xpPerLevel * 100}%"></div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600">⭐</span>
            <span id="game-stars" class="text-xl font-bold text-yellow-500">${this.totalStars}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="achievements-btn" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
            🏆 Achievements (${this.achievements.size})
          </button>
        </div>
      </div>
    `;
    
    // Вставить после header
    header.insertAdjacentElement('afterend', gameUI);
    
    // Обновить значения
    this.updateTotalStars();
    document.getElementById('game-stars').textContent = this.totalStars;
    
    // Обработчик кнопки достижений
    document.getElementById('achievements-btn').addEventListener('click', () => {
      this.showAchievementsModal();
    });
  }
  
  // Показать модальное окно достижений
  showAchievementsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slate-900">🏆 Achievements</h2>
          <button class="close-achievements text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Object.entries(this.achievementsConfig).map(([id, achievement]) => {
            const unlocked = this.achievements.has(id);
            return `
              <div class="p-4 rounded-lg border-2 ${unlocked ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50'}">
                <div class="flex items-center gap-3">
                  <span class="text-3xl ${unlocked ? '' : 'grayscale opacity-50'}">${achievement.icon}</span>
                  <div class="flex-1">
                    <h3 class="font-semibold ${unlocked ? 'text-slate-900' : 'text-slate-500'}">${achievement.name}</h3>
                    <p class="text-sm ${unlocked ? 'text-slate-600' : 'text-slate-400'}">${achievement.description}</p>
                    ${unlocked ? '<span class="text-xs text-purple-600 font-medium mt-1 block">✓ Unlocked</span>' : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрыть по клику вне модального окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('close-achievements')) {
        modal.remove();
      }
    });
  }
  
  // Сохранить прогресс
  saveProgress() {
    const progress = {
      xp: this.xp,
      level: this.level,
      achievements: Array.from(this.achievements),
      taskStars: this.taskStars,
      totalStars: this.totalStars,
      completedTasks: Array.from(this.completedTasks)
    };
    
    // Сохранить в localStorage
    localStorage.setItem('simulator_game_progress', JSON.stringify(progress));
    
    // Также можно сохранить в Firebase если нужно
    if (window.firebase && window.auth && window.auth.currentUser) {
      // Сохранение в Firebase
      const userRef = window.firebase.firestore()
        .collection('users')
        .doc(window.auth.currentUser.uid);
      
      userRef.set({
        gameProgress: progress,
        lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  }
  
  // Загрузить прогресс
  loadProgress() {
    // Из localStorage
    const saved = localStorage.getItem('simulator_game_progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        this.xp = progress.xp || 0;
        this.level = progress.level || 1;
        this.achievements = new Set(progress.achievements || []);
        this.taskStars = progress.taskStars || {};
        this.completedTasks = new Set(progress.completedTasks || []);
        this.updateTotalStars();
        this.renderUI();
        return true;
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
    
    return false;
  }
  
  // Оценить ответ на вопрос (возвращает 1-3 звезды)
  evaluateAnswer(questionId, answer, correctAnswer) {
    // Простая логика оценки
    if (answer === correctAnswer) {
      return 3; // Правильный ответ
    } else if (this.isCloseAnswer(answer, correctAnswer)) {
      return 2; // Близко к правильному
    } else {
      return 1; // Неправильный ответ
    }
  }
  
  // Проверить, близок ли ответ к правильному
  isCloseAnswer(answer, correctAnswer) {
    // Простая проверка (можно улучшить)
    const answerLower = answer.toLowerCase().trim();
    const correctLower = correctAnswer.toLowerCase().trim();
    
    // Если содержит ключевые слова
    const keywords = correctLower.split(' ');
    const matches = keywords.filter(kw => answerLower.includes(kw));
    
    return matches.length >= keywords.length * 0.5;
  }
  
  // Получить статистику
  getStats() {
    return {
      xp: this.xp,
      level: this.level,
      totalStars: this.totalStars,
      achievementsCount: this.achievements.size,
      tasksCompleted: Object.keys(this.taskStars).length,
      averageStars: this.totalStars / Math.max(Object.keys(this.taskStars).length, 1)
    };
  }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimulatorGameEngine;
} else {
  window.SimulatorGameEngine = SimulatorGameEngine;
}
