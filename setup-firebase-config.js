#!/usr/bin/env node

/**
 * 🔥 Firebase Configuration Setup Script
 * 
 * Автоматически настраивает конфигурацию Firebase для разных окружений
 * 
 * Использование:
 * node setup-firebase-config.js dev    - для разработки
 * node setup-firebase-config.js prod   - для продакшена
 */

const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'dev';

console.log(`🔧 Setting up Firebase configuration for: ${environment}`);

// Конфигурации для разных окружений
const configs = {
  dev: {
    source: 'firebase-config.example.js',
    target: 'firebase-config.js',
    description: 'Development configuration'
  },
  prod: {
    source: 'firebase-config-prod.js',
    target: 'firebase-config.js',
    description: 'Production configuration'
  }
};

const config = configs[environment];

if (!config) {
  console.error('❌ Invalid environment. Use "dev" or "prod"');
  process.exit(1);
}

// Проверяем, существует ли исходный файл
if (!fs.existsSync(config.source)) {
  console.error(`❌ Source file not found: ${config.source}`);
  process.exit(1);
}

try {
  // Копируем конфигурацию
  const sourceContent = fs.readFileSync(config.source, 'utf8');
  fs.writeFileSync(config.target, sourceContent);
  
  console.log(`✅ ${config.description} copied to ${config.target}`);
  console.log(`📁 Source: ${config.source}`);
  console.log(`📁 Target: ${config.target}`);
  
  // Показываем предупреждение для продакшена
  if (environment === 'prod') {
    console.log('');
    console.log('⚠️  IMPORTANT: Update firebase-config.js with your real Firebase data!');
    console.log('   1. Open firebase-config.js');
    console.log('   2. Replace placeholder values with your Firebase project data');
    console.log('   3. Test the connection with firebase-test.html');
  }
  
} catch (error) {
  console.error('❌ Error setting up configuration:', error.message);
  process.exit(1);
}
