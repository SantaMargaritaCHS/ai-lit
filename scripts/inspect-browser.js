#!/usr/bin/env node

/**
 * Automated Browser Inspection Script
 *
 * Uses Browserless API to inspect the running application,
 * capture DevTools data, and diagnose issues automatically.
 */

import https from 'https';
import http from 'http';

const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY || process.env.BROWSERLESS_TOKEN;
const APP_URL = process.env.APP_URL || 'http://localhost:5000/module/what-is-ai';
const DEV_MODE_PASSWORD = '752465Ledezma';

if (!BROWSERLESS_API_KEY) {
  console.error('❌ BROWSERLESS_API_KEY not found in environment');
  console.error('💡 Add BROWSERLESS_API_KEY to your Replit Secrets');
  process.exit(1);
}

async function inspectApplication() {
  console.log('🔍 Starting automated browser inspection...\n');

  // Browserless REST API endpoint (new production endpoint)
  const browserlessUrl = `https://production-sfo.browserless.io/content?token=${BROWSERLESS_API_KEY}`;

  const inspectionScript = `
    const url = '${APP_URL}';
    console.log('Navigating to:', url);

    // Navigate to the app
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for React to load
    await page.waitForTimeout(2000);

    // Capture console logs
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture network requests
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('generativelanguage.googleapis.com')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('generativelanguage.googleapis.com')) {
        networkRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // Check for environment variables in the page
    const envCheck = await page.evaluate(() => {
      return {
        hasViteGeminiKey: typeof import.meta.env?.VITE_GEMINI_API_KEY !== 'undefined',
        hasGeminiKey: typeof import.meta.env?.GEMINI_API_KEY !== 'undefined',
        viteGeminiKey: import.meta.env?.VITE_GEMINI_API_KEY ? 'SET (hidden)' : 'NOT SET',
        geminiKey: import.meta.env?.GEMINI_API_KEY ? 'SET (hidden)' : 'NOT SET'
      };
    });

    // Take initial screenshot
    const screenshotBefore = await page.screenshot({ encoding: 'base64', fullPage: true });

    // Try to activate developer mode
    console.log('Attempting to activate developer mode...');
    await page.keyboard.down('Control');
    await page.keyboard.down('Alt');
    await page.keyboard.press('KeyD');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Control');
    await page.waitForTimeout(1000);

    // Check if password prompt appeared
    const hasPasswordPrompt = await page.evaluate(() => {
      return document.querySelector('input[type="password"]') !== null;
    });

    if (hasPasswordPrompt) {
      console.log('Password prompt found, entering password...');
      await page.type('input[type="password"]', '${DEV_MODE_PASSWORD}');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }

    // Check if dev panel is visible
    const hasDevPanel = await page.evaluate(() => {
      return document.querySelector('[class*="dev"]') !== null ||
             document.querySelector('[class*="Dev"]') !== null;
    });

    // Take screenshot after dev mode
    const screenshotAfter = await page.screenshot({ encoding: 'base64', fullPage: true });

    // Try to find and click on a reflection activity
    console.log('Looking for reflection activity...');
    const foundActivity = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, select'));
      const reflectionButton = buttons.find(btn =>
        btn.textContent.includes('Reflection') ||
        btn.textContent.includes('reflection')
      );

      if (reflectionButton) {
        reflectionButton.click();
        return true;
      }
      return false;
    });

    if (foundActivity) {
      await page.waitForTimeout(3000);

      // Try to submit a test reflection
      console.log('Attempting to submit test reflection...');
      const submissionResult = await page.evaluate(() => {
        const textarea = document.querySelector('textarea');
        const submitButton = Array.from(document.querySelectorAll('button')).find(btn =>
          btn.textContent.includes('Submit') || btn.textContent.includes('Continue')
        );

        if (textarea && submitButton) {
          textarea.value = 'This is a test reflection about AI and its impact on society. I think AI will change many aspects of our daily lives.';
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          submitButton.click();
          return { success: true };
        }
        return { success: false, reason: 'Could not find textarea or submit button' };
      });

      // Wait for feedback
      await page.waitForTimeout(5000);

      // Capture feedback
      const feedback = await page.evaluate(() => {
        const feedbackElements = Array.from(document.querySelectorAll('p, div')).filter(el =>
          el.textContent.length > 50 &&
          (el.textContent.includes('thank') || el.textContent.includes('Thank') ||
           el.textContent.includes('great') || el.textContent.includes('reflection'))
        );

        return feedbackElements.map(el => el.textContent).slice(0, 3);
      });

      return {
        envCheck,
        consoleLogs: consoleLogs.slice(-20), // Last 20 logs
        networkRequests,
        hasPasswordPrompt,
        hasDevPanel,
        foundActivity,
        submissionResult,
        feedback,
        screenshots: {
          before: screenshotBefore,
          after: screenshotAfter
        }
      };
    }

    return {
      envCheck,
      consoleLogs: consoleLogs.slice(-20),
      networkRequests,
      hasPasswordPrompt,
      hasDevPanel,
      foundActivity: false,
      screenshots: {
        before: screenshotBefore,
        after: screenshotAfter
      }
    };
  `;

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      code: inspectionScript,
      context: {}
    });

    const options = {
      hostname: 'production-sfo.browserless.io',
      port: 443,
      path: `/content?token=${BROWSERLESS_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          console.log('Raw response:', data);
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          console.error('Response was not JSON:', data);
          reject(new Error(`Failed to parse response: ${e.message}\n\nFull response: ${data.substring(0, 500)}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    const results = await inspectApplication();

    console.log('📊 INSPECTION RESULTS\n');
    console.log('=' .repeat(60));

    console.log('\n🔑 Environment Variables Check:');
    console.log(JSON.stringify(results.envCheck, null, 2));

    console.log('\n📝 Console Logs (last 20):');
    results.consoleLogs?.forEach((log, i) => {
      console.log(`  [${log.type}] ${log.text}`);
    });

    console.log('\n🌐 Gemini API Network Requests:');
    if (results.networkRequests?.length > 0) {
      console.log('✅ Found Gemini API requests!');
      results.networkRequests.forEach(req => {
        console.log(JSON.stringify(req, null, 2));
      });
    } else {
      console.log('❌ No Gemini API requests detected');
    }

    console.log('\n🎮 Developer Mode:');
    console.log(`  Password Prompt: ${results.hasPasswordPrompt ? '✅' : '❌'}`);
    console.log(`  Dev Panel Visible: ${results.hasDevPanel ? '✅' : '❌'}`);

    console.log('\n🎯 Activity Testing:');
    console.log(`  Found Activity: ${results.foundActivity ? '✅' : '❌'}`);

    if (results.submissionResult) {
      console.log(`  Submission: ${results.submissionResult.success ? '✅' : '❌'}`);
      if (!results.submissionResult.success) {
        console.log(`  Reason: ${results.submissionResult.reason}`);
      }
    }

    if (results.feedback && results.feedback.length > 0) {
      console.log('\n💬 Feedback Received:');
      results.feedback.forEach((fb, i) => {
        console.log(`  ${i + 1}. ${fb.substring(0, 150)}...`);
      });
    }

    console.log('\n📸 Screenshots saved (base64)');
    console.log(`  Before: ${results.screenshots?.before?.substring(0, 50)}...`);
    console.log(`  After: ${results.screenshots?.after?.substring(0, 50)}...`);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Inspection complete!');

  } catch (error) {
    console.error('❌ Inspection failed:', error.message);
    process.exit(1);
  }
}

main();
