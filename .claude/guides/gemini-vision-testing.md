# Gemini Vision Testing Guide

## Overview
This project uses Gemini Vision API to automatically analyze the application's UI and diagnose issues. Superior to traditional browser automation because Gemini understands context, identifies bugs, and provides actionable insights.

## Critical Requirement

**MUST USE PRODUCTION URL FOR ALL VISION TESTING**

✅ **Correct**: `https://AILitStudents.replit.app`
❌ **Incorrect**: `http://localhost:5000` or `http://localhost:5001`

### Why Production URL Only?

1. **School Device Restrictions**: Developer works on school device with restricted permissions preventing:
   - Local tunneling tools (ngrok, localtunnel, etc.)
   - Network proxy software
   - Any tools that expose localhost to the internet

2. **Browserless API Requirements**: Browserless screenshot API requires publicly accessible URLs:
   - Runs on external servers
   - Needs to fetch URL over public internet
   - Private/local addresses not accessible to external services

3. **Replit Production Always Available**:
   - Automatically deployed and accessible
   - Has automatic HTTPS
   - Publicly accessible for testing
   - Matches actual user experience

## Key Scripts

### 1. Gemini Vision Inspector
**Path**: `/home/runner/workspace/scripts/gemini-vision-inspector.js`

**What it does**:
- Takes screenshots using Browserless API
- Analyzes screenshots with Gemini Vision
- Identifies UI issues, bugs, testing opportunities
- Provides detailed, actionable recommendations

**Usage**:
```bash
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

**When to use**:
- "Inspect the What Is AI module"
- "Check if the UI looks correct"
- "Analyze the current state of the app"
- "Take a screenshot and tell me what you see"

### 2. Console Log Analyzer
**Path**: `/home/runner/workspace/scripts/analyze-console-logs.js`

**What it does**:
- Takes console logs from browser DevTools
- Uses Gemini to analyze and diagnose issues
- Identifies missing logs, errors, configuration problems

**Usage**:
```bash
node /home/runner/workspace/scripts/analyze-console-logs.js
```

## Screenshot + Vision Workflow

### Best Practice for Debugging

1. **Take screenshot with Browserless**:
```bash
curl -X POST 'https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://AILitStudents.replit.app/module/what-is-ai"}' \
  --output /home/runner/workspace/screenshots/debug.png
```

2. **Analyze with Gemini Vision**:
```bash
node /home/runner/workspace/scripts/gemini-vision-inspector.js
```

3. **Follow Gemini's recommendations** for next steps

## Advantages Over Traditional Automation

### Traditional Browser Automation (Puppeteer/Playwright)
- ❌ Requires complex scripting
- ❌ Breaks when UI changes
- ❌ Can't understand context
- ❌ Difficult to maintain

### Gemini Vision Approach
- ✅ Natural language analysis
- ✅ Understands context and intent
- ✅ Identifies bugs humans might miss
- ✅ Provides actionable recommendations
- ✅ Works with any screenshot
- ✅ No complex scripting needed

## Common Use Cases

### Testing Gemini API Feedback
```bash
# 1. Take screenshot of reflection activity
curl -X POST 'https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://AILitStudents.replit.app/module/what-is-ai"}' \
  --output screenshots/reflection-test.png

# 2. Ask Gemini to analyze
node scripts/gemini-vision-inspector.js

# 3. Follow its guidance to test feedback
```

### Debugging UI Issues
```bash
# Just run the inspector - it handles everything
node scripts/gemini-vision-inspector.js
```

### Analyzing Console Logs
```bash
# Copy console logs from DevTools and paste when prompted
node scripts/analyze-console-logs.js
```

## When Claude Should Use Gemini Vision

1. **User reports UI bug**: "The button isn't showing"
   → Take screenshot, analyze with Gemini Vision

2. **Testing new features**: "Does the reflection activity look right?"
   → Screenshot + analysis

3. **Debugging errors**: "Why isn't the feedback working?"
   → Analyze console logs + screenshot

4. **Visual regression**: "Did my changes break the UI?"
   → Before/after screenshots + comparison

5. **Accessibility review**: "Is this accessible?"
   → Gemini can identify contrast issues, missing labels, etc.

## Required API Keys

- `GEMINI_API_KEY`: For vision analysis (stored in `.secrets.local`)
- `BROWSERLESS_API_KEY`: For taking screenshots (stored in `.secrets.local`)

**NEVER commit these to git!**

## Screenshot Storage

All screenshots saved to: `/home/runner/workspace/screenshots/`

**IMPORTANT**: This directory is **IN .gitignore** - screenshots are never committed to git. They are temporary debugging artifacts regenerated as needed.

## What This Means for Testing

- All Gemini Vision testing MUST use production URL
- Changes must be deployed/visible on production before vision testing
- Cannot test local changes with vision until they're deployed
- For local testing, use browser DevTools and manual inspection instead

## Troubleshooting

### "BROWSERLESS_API_KEY not found"
```bash
# Load secrets
source /home/runner/workspace/.secrets.local

# Or export manually
export BROWSERLESS_API_KEY="your_key_here"
```

### "Gemini API key not found"
```bash
# Check if set
echo $GEMINI_API_KEY

# Load from secrets file
source /home/runner/workspace/.secrets.local
```

### Screenshot fails
- Ensure Browserless account is active
- Check API quota hasn't been exceeded
- Verify the URL is publicly accessible

## Files & Git Status

| File | Purpose | Git Status |
|------|---------|------------|
| `/home/runner/workspace/scripts/gemini-vision-inspector.js` | Main vision analyzer | ✅ Commit |
| `/home/runner/workspace/scripts/analyze-console-logs.js` | Console log analyzer | ✅ Commit |
| `/home/runner/workspace/.secrets.local` | API keys storage | ❌ **NEVER COMMIT** |
| `/home/runner/workspace/screenshots/` | Screenshot storage | ❌ **NEVER COMMIT** (gitignored) |
