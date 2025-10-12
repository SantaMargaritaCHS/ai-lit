#!/usr/bin/env node

/**
 * Automated Gemini Feedback Testing
 *
 * Uses Browserless to:
 * 1. Navigate to the What Is AI module
 * 2. Fill in name and start module
 * 3. Activate dev mode
 * 4. Jump to reflection activity
 * 5. Submit a test reflection
 * 6. Capture console logs and network requests
 * 7. Report if Gemini API is working
 */

import https from 'https';

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_API_KEY || '2T3ttOZ6j2MBQfF8ae79ecd0b511a8b11909bfa1f57f3a90c';
const APP_URL = 'https://AILitStudents.replit.app/module/what-is-ai';

console.log('🔍 Starting Gemini Feedback Test...\n');

const puppeteerScript = `
export default async ({ page }) => {
  const consoleLogs = [];
  const networkRequests = [];

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({
      type: msg.type(),
      text: text
    });
  });

  // Capture network requests to Gemini API
  page.on('request', request => {
    const url = request.url();
    if (url.includes('generativelanguage.googleapis.com')) {
      networkRequests.push({
        type: 'request',
        url: url,
        method: request.method()
      });
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('generativelanguage.googleapis.com')) {
      networkRequests.push({
        type: 'response',
        url: url,
        status: response.status()
      });
    }
  });

  console.log('📱 Navigating to module...');
  await page.goto('${APP_URL}', { waitUntil: 'networkidle0', timeout: 30000 });

  // Take screenshot of name entry
  const screenshot1 = await page.screenshot({ encoding: 'base64' });

  // Fill in name
  console.log('✏️  Filling in name...');
  await page.type('input[placeholder*="name"]', 'Test User');
  await page.click('input[type="checkbox"]');

  // Find and click Start Learning button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startButton = buttons.find(btn => btn.textContent.includes('Start Learning'));
    if (startButton) startButton.click();
  });

  // Wait for module to load
  await new Promise(r => setTimeout(r, 3000));

  // Activate dev mode
  console.log('🔧 Activating dev mode...');
  await page.keyboard.down('Control');
  await page.keyboard.down('Alt');
  await page.keyboard.press('KeyD');
  await page.keyboard.up('Alt');
  await page.keyboard.up('Control');

  await new Promise(r => setTimeout(r, 1000));

  // Check if password prompt appeared
  const hasPasswordPrompt = await page.$('input[type="password"]');
  if (hasPasswordPrompt) {
    console.log('🔑 Entering dev mode password...');
    await page.type('input[type="password"]', '752465Ledezma');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
  }

  // Take screenshot after dev mode
  const screenshot2 = await page.screenshot({ encoding: 'base64' });

  // Try to find and click on reflection activity
  console.log('🎯 Looking for reflection activity...');
  const reflectionButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button, select option'));
    return buttons.find(btn =>
      btn.textContent && btn.textContent.toLowerCase().includes('reflection')
    );
  });

  if (reflectionButton) {
    console.log('✅ Found reflection activity, clicking...');
    await reflectionButton.asElement().click();
    await new Promise(r => setTimeout(r, 3000));
  }

  // Try to submit a reflection
  console.log('📝 Attempting to submit test reflection...');
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.type('This is a comprehensive test reflection about artificial intelligence. AI is transforming how we learn, work, and interact with technology in profound ways. I think the implications are far-reaching.');

    await new Promise(r => setTimeout(r, 1000));

    // Find and click submit button
    const submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn =>
        btn.textContent && (
          btn.textContent.toLowerCase().includes('submit') ||
          btn.textContent.toLowerCase().includes('continue')
        )
      );
    });

    if (submitButton) {
      console.log('🚀 Submitting reflection...');
      await submitButton.asElement().click();

      // Wait for feedback (important!)
      console.log('⏳ Waiting for Gemini API response...');
      await new Promise(r => setTimeout(r, 8000));
    }
  }

  // Take final screenshot
  const screenshot3 = await page.screenshot({ encoding: 'base64', fullPage: true });

  // Extract feedback text
  const feedbackText = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('p, div'));
    const feedbackElements = elements.filter(el =>
      el.textContent.length > 50 &&
      (el.textContent.toLowerCase().includes('thank') ||
       el.textContent.toLowerCase().includes('great') ||
       el.textContent.toLowerCase().includes('reflection') ||
       el.textContent.toLowerCase().includes('response'))
    );
    return feedbackElements.map(el => el.textContent).slice(0, 3);
  });

  // Check for Gemini-specific console messages
  const geminiKeyMessage = consoleLogs.find(log =>
    log.text.includes('Gemini API key') || log.text.includes('GEMINI')
  );

  const geminiUsedMessage = consoleLogs.find(log =>
    log.text.includes('Using AI-generated feedback') ||
    log.text.includes('Using fallback feedback')
  );

  return {
    success: true,
    consoleLogs: consoleLogs.slice(-30), // Last 30 logs
    networkRequests,
    feedbackText,
    geminiKeyMessage,
    geminiUsedMessage,
    screenshots: {
      nameEntry: screenshot1,
      devMode: screenshot2,
      final: screenshot3
    }
  };
};
`;

// Make request to Browserless
const postData = JSON.stringify({
  code: puppeteerScript
});

const options = {
  hostname: 'production-sfo.browserless.io',
  port: 443,
  path: `/function?token=${BROWSERLESS_TOKEN}`,
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
      const result = JSON.parse(data);

      console.log('\n📊 ========== TEST RESULTS ==========\n');

      console.log('📝 Console Logs (last 30):');
      console.log('─'.repeat(60));
      if (result.consoleLogs) {
        result.consoleLogs.forEach(log => {
          console.log(`[${log.type}] ${log.text}`);
        });
      }

      console.log('\n🌐 Network Requests to Gemini API:');
      console.log('─'.repeat(60));
      if (result.networkRequests && result.networkRequests.length > 0) {
        console.log('✅ GEMINI API WAS CALLED!');
        result.networkRequests.forEach(req => {
          console.log(JSON.stringify(req, null, 2));
        });
      } else {
        console.log('❌ NO Gemini API requests detected');
      }

      console.log('\n🔑 Gemini Key Detection:');
      console.log('─'.repeat(60));
      if (result.geminiKeyMessage) {
        console.log('✅', result.geminiKeyMessage.text);
      } else {
        console.log('⚠️  No Gemini key message found');
      }

      console.log('\n💬 Feedback Type:');
      console.log('─'.repeat(60));
      if (result.geminiUsedMessage) {
        console.log(result.geminiUsedMessage.text);
      } else {
        console.log('⚠️  Could not determine feedback type');
      }

      console.log('\n📝 Feedback Text Captured:');
      console.log('─'.repeat(60));
      if (result.feedbackText && result.feedbackText.length > 0) {
        result.feedbackText.forEach((text, i) => {
          console.log(`${i + 1}. ${text.substring(0, 200)}...`);
        });
      } else {
        console.log('⚠️  No feedback text captured');
      }

      console.log('\n📸 Screenshots:');
      console.log('─'.repeat(60));
      console.log('✅ 3 screenshots captured (base64 encoded)');

      console.log('\n🎯 DIAGNOSIS:');
      console.log('─'.repeat(60));

      if (result.networkRequests && result.networkRequests.length > 0) {
        const responses = result.networkRequests.filter(r => r.type === 'response');
        if (responses.length > 0) {
          const success = responses.some(r => r.status === 200);
          if (success) {
            console.log('✅ GEMINI API IS WORKING! Status 200 OK');
          } else {
            console.log('❌ Gemini API called but failed:');
            responses.forEach(r => {
              console.log(`   Status ${r.status}`);
            });
          }
        }
      } else {
        console.log('❌ Gemini API was NOT called');
        console.log('Possible reasons:');
        console.log('  1. API key not exposed to browser');
        console.log('  2. Gemini client code not executed');
        console.log('  3. Feedback function using fallback immediately');
      }

      console.log('\n' + '='.repeat(60));

    } catch (e) {
      console.error('❌ Failed to parse response:', e.message);
      console.error('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  process.exit(1);
});

req.write(postData);
req.end();
