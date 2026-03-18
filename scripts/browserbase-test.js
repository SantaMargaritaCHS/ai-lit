#!/usr/bin/env node
/**
 * Browserbase Module Tester
 * Tests a single module on ailit.smedtech.org via Browserbase
 * Usage: node browserbase-test.js <module-slug> [--dev-mode]
 */

import puppeteer from 'puppeteer-core';

const API_KEY = process.env.BROWSERBASE_API_KEY || 'bb_live_y82j4cJcn36A8nGdNAvClO9Zee0';
const BASE_URL = 'https://ailit.smedtech.org';
const MODULE_SLUG = process.argv[2] || 'what-is-ai';
const DEV_MODE = process.argv.includes('--dev-mode');
const DEV_PASSWORD = '752465Ledezma';

async function createSession() {
  const resp = await fetch('https://api.browserbase.com/v1/sessions', {
    method: 'POST',
    headers: {
      'x-bb-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectId: process.env.BROWSERBASE_PROJECT_ID || undefined,
      browserSettings: {
        viewport: { width: 1280, height: 900 },
      },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to create session: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  return data;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testModule(page, slug) {
  const results = {
    module: slug,
    url: `${BASE_URL}/module/${slug}`,
    pageLoaded: false,
    hasContent: false,
    hasTitle: false,
    moduleTitle: '',
    hasStartButton: false,
    activitiesFound: 0,
    hasVideoPlayer: false,
    hasFirebaseConnection: false,
    devModeActivated: false,
    activitiesCompleted: 0,
    certificateReached: false,
    errors: [],
    screenshots: [],
    timestamp: new Date().toISOString(),
  };

  try {
    // Navigate to module
    console.log(`\n--- Testing: /module/${slug} ---`);
    await page.goto(results.url, { waitUntil: 'networkidle2', timeout: 30000 });
    results.pageLoaded = true;
    console.log('  Page loaded');

    // Wait for React to render
    await sleep(3000);

    // Check for content
    const bodyText = await page.evaluate(() => document.body.innerText);
    results.hasContent = bodyText.length > 50;
    console.log(`  Content length: ${bodyText.length} chars`);

    // Check for module title
    const titleEl = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      return h1?.innerText || h2?.innerText || '';
    });
    results.moduleTitle = titleEl;
    results.hasTitle = titleEl.length > 0;
    console.log(`  Title: ${titleEl || '(none found)'}`);

    // Check for video player
    results.hasVideoPlayer = await page.evaluate(() => {
      return !!document.querySelector('video') ||
             !!document.querySelector('[class*="video"]') ||
             !!document.querySelector('[class*="Video"]');
    });
    console.log(`  Video player: ${results.hasVideoPlayer}`);

    // Check for Firebase connection (look for firebase in network or storage URLs)
    results.hasFirebaseConnection = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      const hasFirebaseScript = scripts.some(s => s.src?.includes('firebase'));
      const bodyHtml = document.body.innerHTML;
      return hasFirebaseScript || bodyHtml.includes('firebase') || bodyHtml.includes('firebasestorage');
    });

    // Check for start/begin button
    results.hasStartButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(b => {
        const text = b.innerText.toLowerCase();
        return text.includes('start') || text.includes('begin') || text.includes('continue') || text.includes('next');
      });
    });
    console.log(`  Start/Next button: ${results.hasStartButton}`);

    // Activate Dev Mode if requested
    if (DEV_MODE) {
      console.log('  Activating Dev Mode...');
      // Press Ctrl+Alt+D
      await page.keyboard.down('Control');
      await page.keyboard.down('Alt');
      await page.keyboard.press('KeyD');
      await page.keyboard.up('Alt');
      await page.keyboard.up('Control');
      await sleep(1000);

      // Type password if prompt appears
      const hasPrompt = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="password"], input[type="text"]');
        for (const input of inputs) {
          if (input.offsetParent !== null) return true;
        }
        // Check for dialog/modal
        return !!document.querySelector('[role="dialog"]') ||
               !!document.querySelector('[class*="modal"]') ||
               !!document.querySelector('[class*="Modal"]');
      });

      if (hasPrompt) {
        // Find the visible input and type password
        await page.evaluate((pwd) => {
          const inputs = document.querySelectorAll('input');
          for (const input of inputs) {
            if (input.offsetParent !== null &&
                (input.type === 'password' || input.type === 'text') &&
                !input.value) {
              input.focus();
              input.value = pwd;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
              break;
            }
          }
        }, DEV_PASSWORD);
        await sleep(500);

        // Press Enter or click submit
        await page.keyboard.press('Enter');
        await sleep(1000);

        // Check if dev mode activated
        results.devModeActivated = await page.evaluate(() => {
          const body = document.body.innerHTML.toLowerCase();
          return body.includes('developer mode') ||
                 body.includes('dev mode') ||
                 body.includes('developer panel');
        });
        console.log(`  Dev Mode activated: ${results.devModeActivated}`);
      }

      // If dev mode is active, try to speed through activities
      if (results.devModeActivated) {
        console.log('  Attempting to complete activities via Dev Mode...');

        let maxIterations = 30; // Safety limit
        let iteration = 0;

        while (iteration < maxIterations) {
          iteration++;
          await sleep(1500);

          // Check if certificate is visible
          const hasCertificate = await page.evaluate(() => {
            const body = document.body.innerText.toLowerCase();
            return body.includes('certificate') &&
                   (body.includes('completion') || body.includes('congratulations') || body.includes('download'));
          });

          if (hasCertificate) {
            results.certificateReached = true;
            console.log(`  Certificate reached after ${iteration} steps!`);
            break;
          }

          // Try clicking "Auto-Fill & Complete" button (dev mode shortcut)
          const clickedAutoFill = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const autoFill = buttons.find(b =>
              b.innerText.toLowerCase().includes('auto-fill') ||
              b.innerText.toLowerCase().includes('auto fill') ||
              b.innerText.toLowerCase().includes('skip')
            );
            if (autoFill) { autoFill.click(); return true; }
            return false;
          });

          if (clickedAutoFill) {
            results.activitiesCompleted++;
            console.log(`  Auto-filled activity (step ${iteration})`);
            await sleep(2000);
            continue;
          }

          // Try clicking Next/Continue/Complete buttons
          const clickedNext = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const nextBtn = buttons.find(b => {
              const text = b.innerText.toLowerCase();
              return (text.includes('next') || text.includes('continue') ||
                      text.includes('complete') || text.includes('proceed') ||
                      text.includes('start') || text.includes('begin') ||
                      text.includes('got it') || text.includes('i understand') ||
                      text.includes('submit')) &&
                     !text.includes('download') &&
                     b.offsetParent !== null &&
                     !b.disabled;
            });
            if (nextBtn) { nextBtn.click(); return nextBtn.innerText; }
            return false;
          });

          if (clickedNext) {
            results.activitiesCompleted++;
            console.log(`  Clicked: "${clickedNext}" (step ${iteration})`);
            await sleep(1500);
            continue;
          }

          // Try clicking on video to mark as watched
          const hasVideo = await page.evaluate(() => {
            const video = document.querySelector('video');
            if (video) {
              // Try to skip to end
              if (video.duration && isFinite(video.duration)) {
                video.currentTime = video.duration - 1;
                video.play();
                return 'skipped-to-end';
              }
              return 'found-no-duration';
            }
            return false;
          });

          if (hasVideo === 'skipped-to-end') {
            console.log(`  Skipped video to end (step ${iteration})`);
            await sleep(3000);
            continue;
          }

          // If nothing clickable, check current state
          const currentState = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const visibleButtons = buttons.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(t => t);
            return {
              buttonCount: visibleButtons.length,
              buttons: visibleButtons.slice(0, 10),
              bodySnippet: document.body.innerText.substring(0, 200),
            };
          });

          console.log(`  Step ${iteration}: ${currentState.buttonCount} buttons visible: [${currentState.buttons.join(', ')}]`);

          // If no progress possible, break
          if (currentState.buttonCount === 0) {
            console.log('  No more buttons found, stopping');
            break;
          }

          // Click first available button as fallback
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.offsetParent !== null && !b.disabled && b.innerText.trim());
            if (btn) btn.click();
          });
          await sleep(1000);
        }
      }
    }

    // Final state check
    const finalState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyLength: document.body.innerText.length,
        hasErrors: !!document.querySelector('[class*="error"]'),
        errorText: document.querySelector('[class*="error"]')?.innerText || '',
      };
    });

    console.log(`  Final URL: ${finalState.url}`);
    console.log(`  Final body length: ${finalState.bodyLength}`);
    if (finalState.hasErrors) {
      results.errors.push(finalState.errorText);
      console.log(`  Error found: ${finalState.errorText}`);
    }

  } catch (err) {
    results.errors.push(err.message);
    console.error(`  ERROR: ${err.message}`);
  }

  return results;
}

async function main() {
  console.log(`=== Browserbase Module Test ===`);
  console.log(`Module: ${MODULE_SLUG}`);
  console.log(`Dev Mode: ${DEV_MODE}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log('');

  // Create Browserbase session
  console.log('Creating Browserbase session...');
  let session;
  try {
    session = await createSession();
    console.log(`Session created: ${session.id}`);
  } catch (err) {
    console.error(`Failed to create session: ${err.message}`);
    // Try connecting directly
    console.log('Trying direct connect...');
  }

  // Connect via Puppeteer
  const connectUrl = session
    ? `wss://connect.browserbase.com?apiKey=${API_KEY}&sessionId=${session.id}`
    : `wss://connect.browserbase.com?apiKey=${API_KEY}`;

  console.log('Connecting to browser...');
  const browser = await puppeteer.connect({ browserWSEndpoint: connectUrl });
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  // Set viewport
  await page.setViewport({ width: 1280, height: 900 });

  // First test homepage
  console.log('\n--- Testing Homepage ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(3000);

  const homeContent = await page.evaluate(() => {
    return {
      title: document.title,
      bodyText: document.body.innerText.substring(0, 500),
      moduleCards: Array.from(document.querySelectorAll('a[href*="/module/"]')).map(a => ({
        href: a.href,
        text: a.innerText.substring(0, 100),
      })),
      allLinks: Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('/module/')),
    };
  });

  console.log(`Homepage title: ${homeContent.title}`);
  console.log(`Module links found: ${homeContent.allLinks.length}`);
  console.log(`Module cards: ${homeContent.moduleCards.length}`);
  if (homeContent.moduleCards.length > 0) {
    homeContent.moduleCards.forEach(c => console.log(`  - ${c.text.substring(0, 60)}`));
  }
  console.log(`Body preview: ${homeContent.bodyText.substring(0, 200)}`);

  // Test the specified module
  const result = await testModule(page, MODULE_SLUG);

  // Print summary
  console.log('\n=== TEST RESULTS ===');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
  console.log('\nBrowser closed. Done.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
