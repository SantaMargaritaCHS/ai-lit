const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'wss://production-sfo.browserless.io/chromium?token=' + process.env.BROWSERLESS_API_KEY,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push('[' + msg.type() + '] ' + msg.text()));

  await page.goto('https://AILitStudents.replit.app/module/introduction-to-prompting', { waitUntil: 'networkidle2', timeout: 30000 });

  // Dismiss name confirmation
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) await checkbox.click();
  await new Promise(r => setTimeout(r, 500));
  
  let btns = await page.$$('button');
  for (const b of btns) {
    const t = await b.evaluate(el => el.textContent);
    if (t && t.includes('Start Learning')) { await b.click(); break; }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Activate Dev Mode
  await page.keyboard.down('Control');
  await page.keyboard.down('Alt');
  await page.keyboard.press('KeyD');
  await page.keyboard.up('Alt');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 1000));

  const pwInput = await page.$('input[type="password"]');
  if (pwInput) {
    await pwInput.type('752465Ledezma');
    await new Promise(r => setTimeout(r, 300));
    btns = await page.$$('button');
    for (const b of btns) {
      const t = await b.evaluate(el => el.textContent);
      if (t && t.includes('Unlock')) { await b.click(); console.log('Unlocked dev mode'); break; }
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  // Click Get Started to enter the module
  btns = await page.$$('button');
  for (const b of btns) {
    const t = await b.evaluate(el => el.textContent);
    if (t && t.includes('Get Started')) { await b.click(); console.log('Clicked Get Started'); break; }
  }
  await new Promise(r => setTimeout(r, 2000));

  // Use goToActivity event to jump to segment 2 (video)
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('goToActivity', { detail: 2 }));
  });
  console.log('Dispatched goToActivity(2)');

  await new Promise(r => setTimeout(r, 10000));
  await page.screenshot({ path: '/home/runner/workspace/screenshots/vdebug-video.png' });

  // Check video state
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('video');
    if (!v) {
      const heading = document.querySelector('h1, h2, h3');
      return { found: false, currentPage: heading ? heading.textContent : 'unknown' };
    }
    return {
      found: true,
      src: (v.src || 'none').substring(0, 200),
      readyState: v.readyState,
      networkState: v.networkState,
      error: v.error ? { code: v.error.code, message: v.error.message } : null,
      duration: v.duration,
      currentTime: v.currentTime,
      paused: v.paused,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      opacity: window.getComputedStyle(v).opacity,
    };
  });

  console.log('\n=== VIDEO STATE ===');
  console.log(JSON.stringify(videoState, null, 2));

  console.log('\n=== CONSOLE (filtered) ===');
  consoleLogs
    .filter(l => l.includes('🎬') || l.includes('🔧') || l.includes('rror') || l.includes('Video') || l.includes('video') || l.includes('firebase') || l.includes('storage') || l.includes('Resolv'))
    .forEach(l => console.log(l));

  await browser.close();
})().catch(e => console.error('FATAL:', e.message || e));
