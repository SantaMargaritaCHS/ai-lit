#!/usr/bin/env node

/**
 * Gemini Vision-Based Inspector
 *
 * Uses:
 * 1. Browserless API to take screenshots
 * 2. Gemini Vision API to analyze what's on screen
 * 3. Gemini to provide insights about the app state
 */

import https from 'https';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load secrets from .secrets.local if available
// In production, these come from environment variables (Replit Secrets)
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!BROWSERLESS_TOKEN) {
  console.error('❌ BROWSERLESS_API_KEY not found');
  console.error('💡 Run: source /home/runner/workspace/.secrets.local');
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found');
  console.error('💡 Run: source /home/runner/workspace/.secrets.local');
  process.exit(1);
}
const APP_URL = 'https://AILitStudents.replit.app/module/what-is-ai';

console.log('🔍 Gemini Vision Inspector Starting...\n');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

async function takeScreenshot(url) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ url });

    const options = {
      hostname: 'production-sfo.browserless.io',
      port: 443,
      path: `/screenshot?token=${BROWSERLESS_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        resolve(base64);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function analyzeWithGemini(imageBase64, prompt) {
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/png',
          data: imageBase64
        }
      }
    ]);

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Gemini analysis failed:', error.message);
    return null;
  }
}

async function main() {
  try {
    // Take screenshot of the main app
    console.log('📸 Taking screenshot of the app...');
    const screenshot = await takeScreenshot(APP_URL);
    console.log('✅ Screenshot captured!\n');

    // Analyze with Gemini Vision
    console.log('🤖 Analyzing with Gemini Vision API...\n');

    const analysisPrompt = `You are analyzing a screenshot of an AI literacy educational web application for high school students. This is the "What is AI?" module.

Please analyze this screenshot and provide:

1. **What's visible on screen**: Describe what elements you see (buttons, text, forms, etc.)
2. **Current state**: What page or step of the module is this?
3. **User actions needed**: What would a user need to do next to progress?
4. **Developer notes**: Any issues, errors, or UI problems you notice
5. **Testing recommendations**: How should we test the Gemini API feedback feature from here?

Be specific and technical. This is for debugging purposes.`;

    const analysis = await analyzeWithGemini(screenshot, analysisPrompt);

    console.log('=' .repeat(60));
    console.log('📊 GEMINI VISION ANALYSIS');
    console.log('='.repeat(60));
    console.log(analysis);
    console.log('='.repeat(60));

    console.log('\n✅ Analysis complete!');
    console.log('\n💡 Next steps:');
    console.log('   Based on the analysis above, we can:');
    console.log('   1. Take more targeted screenshots');
    console.log('   2. Use Gemini to guide our testing');
    console.log('   3. Identify exactly what needs to be tested');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
