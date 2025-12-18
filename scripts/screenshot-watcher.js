#!/usr/bin/env node

/**
 * Screenshot Watcher
 *
 * Monitors /home/runner/workspace/screenshots/ for new image files
 * and automatically displays them in Claude Code conversations.
 *
 * Usage: node scripts/screenshot-watcher.js
 * Or: npm run watch:screenshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

// Track already processed files
const processedFiles = new Set();

// Initialize with existing files (don't auto-display on startup)
function initializeProcessedFiles() {
  try {
    const files = fs.readdirSync(SCREENSHOTS_DIR);
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        processedFiles.add(file);
      }
    });
    console.log(`📸 Screenshot watcher initialized. Monitoring: ${SCREENSHOTS_DIR}`);
    console.log(`   Already tracked: ${processedFiles.size} files`);
    console.log(`   Waiting for new screenshots...`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
      console.log(`📁 Created directory: ${SCREENSHOTS_DIR}`);
    } else {
      console.error('Error initializing:', err.message);
    }
  }
}

// Display screenshot information
function displayScreenshot(filePath, filename) {
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  const timestamp = new Date().toLocaleTimeString();

  console.log('\n' + '='.repeat(60));
  console.log(`🖼️  NEW SCREENSHOT DETECTED`);
  console.log('='.repeat(60));
  console.log(`📁 File: ${filename}`);
  console.log(`📏 Size: ${sizeKB} KB`);
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`📍 Path: ${filePath}`);
  console.log('='.repeat(60));
  console.log('\n💡 TIP: Claude Code will automatically read this file when you reference it.');
  console.log(`    Just say: "Look at ${filename}" or "Read ${filePath}"\n`);
}

// Watch for new files
function watchScreenshots() {
  // Check for new files every 2 seconds (polling approach for reliability)
  setInterval(() => {
    try {
      const files = fs.readdirSync(SCREENSHOTS_DIR);

      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();

        // Check if it's an image and hasn't been processed
        if (SUPPORTED_EXTENSIONS.includes(ext) && !processedFiles.has(file)) {
          const filePath = path.join(SCREENSHOTS_DIR, file);

          // Mark as processed
          processedFiles.add(file);

          // Display information
          displayScreenshot(filePath, file);
        }
      });
    } catch (err) {
      console.error('Error watching directory:', err.message);
    }
  }, 2000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Screenshot watcher stopped.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Screenshot watcher stopped.');
  process.exit(0);
});

// Start watching
console.log('🚀 Starting screenshot watcher...\n');
initializeProcessedFiles();
watchScreenshots();
